import { useEffect, useState } from "react";

function InventoryList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([
      { id: 1, name: "دقيق", quantity: 100 },
      { id: 2, name: "بلح", quantity: 50 },
      { id: 3, name: "سكر", quantity: 30 }
    ]);
  }, []);

  return (
    <div>
      <h1>المخزون</h1>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>اسم المادة</th>
            <th>الكمية</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;
