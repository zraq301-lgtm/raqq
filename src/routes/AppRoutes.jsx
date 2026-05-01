import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import InventoryList from "../pages/Inventory/InventoryList.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
