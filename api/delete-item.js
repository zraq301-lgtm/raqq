import { MongoClient } from "mongodb";

// المتغير المطلوب استخدامه للاتصال بقاعدة البيانات
const uri = process.env.MONGODB_URI; 
let client;
let clientPromise;

if (!uri) {
  throw new Error("الرجاء إضافة MONGODB_URI إلى إعدادات البيئة (Environment Variables)");
}

// إعداد الاتصال لضمان عدم تكرار فتح الاتصالات في بيئة Serverless
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(request, response) {
  // 1. إعدادات CORS الشاملة
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // معالجة طلب OPTIONS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 2. التحقق من نوع الطلب
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'الرجاء استخدام POST لإتمام عملية الحذف' });
  }

  try {
    // 3. استلام البيانات من Body (collectionName و id)
    const { collectionName, id } = request.body;

    if (!collectionName || !id) {
      return response.status(400).json({ error: 'Missing collectionName or id' });
    }

    const client = await clientPromise;
    const db = client.db("maamoul_db");

    // 4. محاولة الحذف الذكي (يدعم النصوص أو الأرقام)
    const query = {
      $or: [
        { id: id },
        { id: isNaN(id) ? id : parseInt(id) },
        { _id: id } 
      ]
    };

    const result = await db.collection(collectionName).deleteOne(query);

    if (result.deletedCount === 1) {
      return response.status(200).json({
        success: true,
        message: `تم الحذف بنجاح من ${collectionName}`
      });
    } else {
      return response.status(404).json({
        success: false,
        message: "العنصر غير موجود في قاعدة بيانات معمول أو تم حذفه مسبقاً"
      });
    }

  } catch (error) {
    console.error('Delete Error:', error);
    return response.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
