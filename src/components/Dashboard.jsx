<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - Dashboard</title>
    <!-- استيراد الخطوط والأيقونات -->
    <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        :root {
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --primary-blue: #2563eb;
            --primary-indigo: #4f46e5;
            --warning-orange: #f97316;
            --danger-red: #ef4444;
            --text-main: #1f2937;
            --text-muted: #64748b;
        }

        body {
            font-family: 'Almarai', sans-serif;
            background-color: var(--bg-color);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .dashboard-container {
            width: 100%;
            max-width: 500px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* كرت حالة النظام */
        .status-card {
            background: var(--card-bg);
            padding: 16px;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-right: 5px solid var(--warning-orange);
        }

        .status-header {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--warning-orange);
            margin-bottom: 4px;
        }

        .status-header span {
            font-size: 14px;
            font-weight: 700;
        }

        .status-value {
            font-size: 24px;
            font-weight: 800;
            color: var(--text-main);
            margin: 0;
        }

        /* شبكة الإحصائيات */
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .stat-box {
            padding: 16px;
            border-radius: 16px;
            color: white;
        }

        .bg-blue { background-color: var(--primary-blue); }
        .bg-indigo { background-color: var(--primary-indigo); }

        .stat-label {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 4px;
        }

        .stat-number {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
        }

        /* قسم التنبيهات */
        .alerts-container {
            background: var(--card-bg);
            padding: 16px;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #f1f5f9;
        }

        .alerts-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }

        .alert-item {
            font-size: 14px;
            color: var(--danger-red);
            background-color: #fef2f2;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .alert-item strong {
            font-weight: 800;
        }
    </style>
</head>
<body>

    <div class="dashboard-container">
        
        <!-- حالة النظام -->
        <div class="status-card">
            <div class="status-header">
                <i data-lucide="activity" size="18"></i>
                <span>حالة النظام</span>
            </div>
            <p class="status-value">مستقر</p>
        </div>

        <!-- الإحصائيات -->
        <div class="stats-grid">
            <div class="stat-box bg-blue">
                <div class="stat-label">إجمالي الوحدات</div>
                <p class="stat-number" id="totalItems">1,250</p>
            </div>
            <div class="stat-box bg-indigo">
                <div class="stat-label">عمليات اليوم</div>
                <p class="stat-number" id="totalOps">42</p>
            </div>
        </div>

        <!-- تنبيهات النقص -->
        <div class="alerts-container">
            <h3 class="alerts-title">
                <i data-lucide="alert-triangle" class="text-danger" style="color: #ef4444;"></i>
                تنبيهات النقص
            </h3>
            
            <div id="alertsList">
                <div class="alert-item">
                    <span>الرصيد منخفض جداً في <strong>قسم الإلكترونيات</strong></span>
                </div>
                <div class="alert-item">
                    <span>الرصيد منخفض جداً في <strong>المشروبات</strong></span>
                </div>
            </div>
        </div>

    </div>

    <!-- تفعيل الأيقونات -->
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
