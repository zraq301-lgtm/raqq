import { MongoClient } from "mongodb";

// استخدام المتغير المطلوب للاتصال
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
    throw new Error("الرجاء إضافة MONGODB_URI إلى إعدادات البيئة (Environment Variables)");
}

// إعداد الاتصال لضمان استقرار الأداء في بيئة Serverless
if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(request, response) {
    // إعدادات الوصول CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') return response.status(200).end();

    // التحقق من أن الطلب GET فقط
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'مسموح فقط بطلبات GET هنا' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("maamoul_db");

        // استخراج اسم المجموعة من الرابط
        const { collectionName } = request.query;

        if (!collectionName) {
            return response.status(400).json({ error: 'يجب تحديد اسم القسم المراد جلبه' });
        }

        // جلب البيانات من قاعدة بيانات معمول
        const data = await db.collection(collectionName).find({}).toArray();

        return response.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        console.error('Fetch Error:', error);
        return response.status(500).json({ error: 'خطأ داخلي في السيرفر', details: error.message });
    }
}
