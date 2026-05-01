import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", direction: "rtl" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
