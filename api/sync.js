import { MongoClient } from "mongodb";

// استخدام المتغير المباشر للاتصال
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
    throw new Error("الرجاء إضافة MONGODB_URI إلى إعدادات البيئة (Environment Variables)");
}

// تهيئة الاتصال لبيئة Serverless
if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(request, response) {
    // إعدادات CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method Not Allowed' });

    try {
        const client = await clientPromise;
        const db = client.db("maamoul_db");
        const { collectionName, data } = request.body;

        // التحقق من وجود البيانات
        if (!collectionName || data === undefined || data === null) {
            return response.status(400).json({ error: 'بيانات ناقصة' });
        }

        if (Array.isArray(data)) {
            // التعامل مع المصفوفات الفارغة لمنع خطأ bulkWrite
            if (data.length === 0) {
                return response.status(200).json({ 
                    success: true, 
                    message: 'لا توجد بيانات للمزامنة (المصفوفة فارغة)',
                    result: { matchedCount: 0, upsertedCount: 0 } 
                });
            }

            const operations = data.map(item => {
                const { _id, ...cleanData } = item; 
                
                return {
                    updateOne: {
                        filter: { id: item.id }, 
                        update: { 
                            $set: { 
                                ...cleanData, 
                                updatedAt: new Date() 
                            } 
                        },
                        upsert: true
                    }
                };
            });

            const result = await db.collection(collectionName).bulkWrite(operations);
            return response.status(200).json({ success: true, result });

        } else {
            // التعامل مع كائن واحد فقط (Single Object)
            const { _id, ...cleanData } = data;
            
            const result = await db.collection(collectionName).updateOne(
                { id: data.id },
                { $set: { ...cleanData, updatedAt: new Date() } },
                { upsert: true }
            );
            return response.status(200).json({ success: true, result });
        }

    } catch (error) {
        console.error('Database Sync Error:', error);
        return response.status(500).json({ error: error.message });
    }
}
