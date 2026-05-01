import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css"; // استيراد التنسيقات لضمان تطبيق تأثير الزجاج والـ UI

// هذا السطر يقوم بربط كود الرياكت بالعنصر ذو الأيدي 'root' الموجود في الـ HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
