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
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  try {
    const { collectionName, id, name } = request.body; // أضفنا Name كخيار احتياطي

    const client = await clientPromise;
    const db = client.db("maamoul_db");

    // بناء مصفوفة شروط البحث (بكل الطرق الممكنة)
    let queryConditions = [
      { id: id },
      { id: isNaN(id) ? id : parseFloat(id) },
      { _id: id }
    ];

    // إضافة شرط الـ ObjectId إذا كان صالحاً
    if (id && ObjectId.isValid(id)) {
      queryConditions.push({ _id: new ObjectId(id) });
    }

    // القوة الإضافية: إذا أرسلت الاسم مع الطلب، سيبحث به أيضاً كحل أخير
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
      // إذا فشل الحذف بالـ ID، نحاول الحذف بالاسم مباشرة (لحل مشكلة "دقيق")
      // سنقوم ببحث أخير بالاسم فقط في حال كان id نصياً يشبه الأسماء
      const finalTry = await db.collection(collectionName).deleteOne({
        $or: [{ name: id }, { item: id }]
      });

      if (finalTry.deletedCount >= 1) {
        return response.status(200).json({ success: true, message: "تم الحذف بواسطة الاسم" });
      }

      return response.status(404).json({ success: false, message: "العنصر غير موجود" });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
