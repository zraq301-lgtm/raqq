import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise;

if (!uri) throw new Error("MONGODB_URI is missing");

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(request, response) {
  // تحديث السماح بالعمليات ليشمل DELETE و POST
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();

  // السماح بـ POST أو DELETE
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // في حالة DELETE قد تأتي البيانات في الـ Body أو الـ Query
    const collectionName = request.body.collectionName || request.query.collectionName || "production";
    const id = request.body.id || request.query.id || request.url.split('/').pop();
    const name = request.body.name || request.query.name;

    const client = await clientPromise;
    const db = client.db("maamoul_db");

    // بناء مصفوفة شروط البحث
    let queryConditions = [
      { id: id },
      { id: isNaN(id) ? id : parseFloat(id) },
      { _id: id }
    ];

    if (id && ObjectId.isValid(id)) {
      queryConditions.push({ _id: new ObjectId(id) });
    }

    if (name) {
      queryConditions.push({ name: name.trim() });
      queryConditions.push({ item: name.trim() });
    }

    const result = await db.collection(collectionName).deleteOne({
      $or: queryConditions
    });

    if (result.deletedCount >= 1) {
      return response.status(200).json({ success: true, message: "تم الحذف بنجاح" });
    } else {
      // محاولة أخيرة بالاسم
      const finalTry = await db.collection(collectionName).deleteOne({
        $or: [{ name: id }, { item: id }]
      });

      if (finalTry.deletedCount >= 1) {
        return response.status(200).json({ success: true, message: "تم الحذف بواسطة الاسم" });
      }

      return response.status(404).json({ success: false, message: "العنصر غير موجود في قاعدة البيانات" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
