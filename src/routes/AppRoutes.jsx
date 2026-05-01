import { BrowserRouter, Routes, Route } from "react-router-dom";

function Dashboard() {
  return <h1>لوحة التحكم تعمل 🎉</h1>;
}

function Inventory() {
  return <h1>المخزون يعمل 🎉</h1>;
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
