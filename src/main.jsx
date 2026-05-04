import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css"; 
// 1. استيراد مكتبة الإشعارات المحلية من كاباسيتور
import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * دالة تهيئة الإشعارات: تطلب الإذن من المستخدم عند فتح التطبيق لأول مرة.
 * وضعناها خارج الـ Render لضمان تشغيلها لمرة واحدة فقط عند إقلاع التطبيق.
 */
const initNotifications = async () => {
  try {
    // التحقق من حالة الإذن الحالية
    const check = await LocalNotifications.checkPermissions();
    
    if (check.display !== 'granted') {
      // طلب الإذن إذا لم يكن ممنوحاً
      await LocalNotifications.requestPermissions();
    }
  } catch (error) {
    console.error("تعذر تهيئة الإشعارات:", error);
  }
};

// تشغيل دالة طلب الإذن
initNotifications();

// هذا السطر يقوم بربط كود الرياكت بالعنصر ذو الأيدي 'root' الموجود في الـ HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
