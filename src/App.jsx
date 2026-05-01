import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import InventoryList from "./pages/Inventory/InventoryList.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
