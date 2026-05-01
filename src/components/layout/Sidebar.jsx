import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: "220px", background: "#f4f4f4", padding: "15px" }}>
      <h3>نظام معمول</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/">لوحة التحكم</Link></li>
        <li><Link to="/inventory">المخزون</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
