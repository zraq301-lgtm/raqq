import { BrowserRouter, Routes, Route } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>🏠 لوحة التحكم</h1>
      <p>النظام يعمل بنجاح</p>
    </div>
  );
}

function Inventory() {
  return (
    <div>
      <h1>📦 المخزون</h1>
      <p>صفحة المخزون تعمل</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}
