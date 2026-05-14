import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise;

if (!uri) {
  throw new Error("الرجاء إضافة MONGODB_URI إلى إعدادات البيئة (Environment Variables)");
}

// إعداد الاتصال لضمان الاستقرار في بيئة Vercel
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
  // 1. إعدادات CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'الرجاء استخدام POST لإتمام عملية الحذف' });
  }

  try {
    const { collectionName, id } = request.body;

    if (!collectionName || !id) {
      return response.status(400).json({ error: 'Missing collectionName or id' });
    }

    const client = await clientPromise;
    const db = client.db("maamoul_db");

    // 2. تحضير الاستعلام (Query) لدعم كافة أنواع المعرفات
    let queryConditions = [
      { id: id }, // البحث لو كان الحقل اسمه id صريح
      { id: isNaN(id) ? id : parseFloat(id) } // البحث لو كان رقم
    ];

    // إضافة البحث عبر _id الخاص بـ MongoDB
    try {
      // إذا كان المعرف صالحاً ليكون ObjectId
      if (ObjectId.isValid(id)) {
        queryConditions.push({ _id: new ObjectId(id) });
      }
      // إضافة البحث كـ نص عادي في _id (بعض الأنظمة تخزنها كـ String)
      queryConditions.push({ _id: id });
    } catch (e) {
      // إذا فشل تحويل ObjectId، نستمر بالبحث العادي
      queryConditions.push({ _id: id });
    }

    // 3. تنفيذ الحذف
    const result = await db.collection(collectionName).deleteOne({
      $or: queryConditions
    });

    if (result.deletedCount === 1) {
      return response.status(200).json({
        success: true,
        message: `تم الحذف بنجاح من ${collectionName}`
      });
    } else {
      // إذا لم يجد العنصر
      return response.status(404).json({
        success: false,
        message: "لم يتم العثور على العنصر. تأكد من صحة الـ ID أو اسم الجدول."
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
