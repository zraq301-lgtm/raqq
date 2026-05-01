<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة المخزون - Inventory</title>
    <!-- استيراد الخطوط والأيقونات -->
    <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        :root {
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --blue-brand: #2563eb;
            --green-success: #22c55e;
            --red-danger: #ef4444;
            --text-dark: #374151;
            --text-gray: #6b7280;
        }

        body {
            font-family: 'Almarai', sans-serif;
            background-color: var(--bg-color);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .inventory-container {
            width: 100%;
            max-width: 500px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* العنوان الرئيسي */
        .section-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 8px;
            border-right: 4px solid var(--blue-brand);
            padding-right: 12px;
        }

        /* كرت القسم */
        .category-card {
            background: var(--card-bg);
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid #f1f5f9;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .category-name {
            font-weight: 700;
            color: var(--text-dark);
            font-size: 1.1rem;
        }

        .balance-badge {
            background-color: #dbeafe;
            color: #1d4ed8;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 800;
        }

        /* منطقة الأزرار */
        .actions-group {
            display: flex;
            gap: 12px;
        }

        .btn {
            flex: 1;
            border: none;
            padding: 14px;
            border-radius: 15px;
            font-family: 'Almarai', sans-serif;
            font-weight: 700;
            font-size: 1rem;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: transform 0.1s ease, opacity 0.2s ease;
        }

        .btn:active {
            transform: scale(0.96);
        }

        .btn-in {
            background-color: var(--green-success);
        }

        .btn-out {
            background-color: var(--red-danger);
        }

        .btn i {
            width: 18px;
            height: 18px;
        }
    </style>
</head>
<body>

    <div class="inventory-container">
        <h2 class="section-title">أقسام المواد الخام</h2>

        <!-- كرت القسم الأول -->
        <div class="category-card">
            <div class="card-header">
                <span class="category-name">خشب زان</span>
                <span class="balance-badge">120 وحدة</span>
            </div>
            <div class="actions-group">
                <button class="btn btn-in" onclick="console.log('توريد خشب زان')">
                    <i data-lucide="plus"></i>
                    توريد
                </button>
                <button class="btn btn-out" onclick="console.log('سحب خشب زان')">
                    <i data-lucide="minus"></i>
                    سحب
                </button>
            </div>
        </div>

        <!-- كرت القسم الثاني -->
        <div class="category-card">
            <div class="card-header">
                <span class="category-name">حديد تسليح</span>
                <span class="balance-badge">45 وحدة</span>
            </div>
            <div class="actions-group">
                <button class="btn btn-in">
                    <i data-lucide="plus"></i>
                    توريد
                </button>
                <button class="btn btn-out">
                    <i data-lucide="minus"></i>
                    سحب
                </button>
            </div>
        </div>

        <!-- كرت القسم الثالث -->
        <div class="category-card">
            <div class="card-header">
                <span class="category-name">أسمنت بورتلاندي</span>
                <span class="balance-badge">8 وحدة</span>
            </div>
            <div class="actions-group">
                <button class="btn btn-in">
                    <i data-lucide="plus"></i>
                    توريد
                </button>
                <button class="btn btn-out">
                    <i data-lucide="minus"></i>
                    سحب
                </button>
            </div>
        </div>

    </div>

    <script>
        // تفعيل أيقونات Lucide
        lucide.createIcons();
    </script>
</body>
</html>
