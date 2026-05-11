export default async function handler(req, res) {
    // إعدادات CORS للسماح بالاتصال من تطبيقك
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { prompt } = req.body;
    const groqKey = process.env.GROQ_API_KEY; 
    const mxbKey = process.env.MXBAI_API_KEY;
    const storeId = "66de0209-e17d-4e42-81d1-3851d5a0d826";

    // --- [إضافة 1: ميزة الرسم المجانية] ---
    const imageKeywords = ["ارسم", "تخيل", "صورة لـ", "صورة ل"];
    if (imageKeywords.some(keyword => prompt?.startsWith(keyword))) {
        const imageDescription = prompt.replace(/ارسم|تخيل|صورة لـ|صورة ل/g, "").trim();
        const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imageDescription)}?width=1024&height=1024&nologo=true`;
        return res.status(200).json({ 
            message: `تفضلي يا رفيقتي، هذه هي الصورة التي تخيلتها لكِ: \n\n ![image](${generatedImageUrl})` 
        });
    }

    try {
        // --- [تعديل 2: فحص وجود رابط صورة للتحليل] ---
        const imageRegex = /https?:\/\/\S+\.(jpg|jpeg|png|webp|gif)/i;
        const foundImageUrl = prompt?.match(imageRegex);

        // 1. البحث أولاً في مكتبة Mixedbread المتخصصة
        let libraryContext = "";
        try {
            const mxbRes = await fetch(`https://api.mixedbread.ai/v1/stores/${storeId}/query`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${mxbKey}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    query: prompt,
                    top_k: 3 
                })
            });

            if (mxbRes.ok) {
                const mxbData = await mxbRes.json();
                libraryContext = mxbData?.hits?.map(h => h.content).join("\n\n") || "";
            }
        } catch (err) {
            console.error("Mixedbread Error: ", err.message);
        }

        // 2. إعداد الطلب لـ Groq مع "الدالة التدريبية للمحلل الذكي"
        let groqModel = "llama-3.3-70b-versatile"; 
        let messages = [];

        // تعريف هوية المحلل (دالة التدريب)
        const productionAnalystSystemPrompt = `
        أنتِ "رقة"، المحللة الذكية لعمليات إنتاج مصنع المعمول. 
        مهمتك الأساسية: 
        1. تحليل بيانات الإنتاج اليومية (الكميات، التكاليف، الورديات).
        2. رصد أي هبوط في الإنتاج لثلاثة أيام متتالية وإصدار تحذير فوري.
        3. مقارنة الإنتاج الحالي بمتطلبات السوق وتوقعات الطلب.
        4. تقديم تقرير ذكي يشمل: (أداء اليوم، نسبة التغير عن الأمس، كفاءة الخامات، وتوصية لتحسين الربحية).
        5. إذا كانت البيانات الموفرة من المكتبة تحتوي على أرقام، استخدمي المعادلات الرياضية بدقة لتقديم نسب مئوية.
        كوني حازمة في التنبيهات، ولبقة في التوصيات.
        المعلومات المتوفرة من سجلاتك: ${libraryContext}
        `;

        if (foundImageUrl) {
            groqModel = "llama-3.2-11b-vision-preview";
            messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: foundImageUrl[0] } }
                    ]
                }
            ];
        } else {
            messages = [
                { role: "system", content: productionAnalystSystemPrompt },
                { role: "user", content: prompt }
            ];
        }

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: groqModel,
                messages: messages,
                temperature: 0.5 // تقليل الحرارة لزيادة الدقة في الأرقام
            })
        });

        const data = await groqRes.json();
        
        if (data.choices && data.choices[0]) {
            res.status(200).json({ message: data.choices[0].message.content });
        } else {
            console.error("Groq Response Error:", data);
            throw new Error(data.error?.message || "فشل رد الذكاء الاصطناعي");
        }

    } catch (error) {
        console.error("Final API Error:", error);
        res.status(200).json({ message: "عذراً، رقة تواجه ضغطاً في تحليل البيانات حالياً. حاولي مرة أخرى." });
    }
}
