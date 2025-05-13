import { useEffect, useState } from "react";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    salesData: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes] = await Promise.all([
          api.get('/api/admin/books'),
          api.get('/api/orders/all')
        ]);

        // monthly sales
        const monthlySales = {};
        ordersRes.data.forEach(o => {
          const m = new Date(o.createdAt)
                    .toLocaleString('default',{month:'short'});
          monthlySales[m] = (monthlySales[m]||0) + o.totalAmount;
        });

        setStats({
          totalBooks: booksRes.data.length,
          totalOrders: ordersRes.data.length,
          totalRevenue: ordersRes.data
            .reduce((sum,o)=>sum+o.totalAmount,0),
          salesData: Object.entries(monthlySales).map(
            ([month,amount]) => ({month,amount})
          ),
          recentOrders: ordersRes.data.slice(0,5)
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  //— NEW: delete handler
  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/api/orders/all/${orderId}`);
      setStats(prev => {
        // remove order
        const removed = prev.recentOrders.find(o=>o._id===orderId);
        const newRecent = prev.recentOrders.filter(o=>o._id!==orderId);
        return {
          ...prev,
          totalOrders: prev.totalOrders - 1,
          totalRevenue: prev.totalRevenue - (removed?.totalAmount || 0),
          recentOrders: newRecent
        };
      });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Books</h3>
          <p className="text-2xl">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Orders</h3>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Revenue</h3>
          <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* monthly sales */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Monthly Sales</h3>
        {stats.salesData.length > 0 ? (
          <BarChart width={600} height={300} data={stats.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={v => [`$${v}`,'Sales']} />
            <Legend />
            <Bar dataKey="amount" name="Sales" />
          </BarChart>
        ) : <p>No sales data available</p>}
      </div>

      {/* recent orders + delete */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {order.user?.displayName || 'Customer'}<br/>
                      <span className="text-sm text-gray-600">
                        {order.user?.email}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.items.slice(0,2).map(item=>(
                        <div key={item.book?._id||item._id}>
                          {item.book?.title||'Unknown'} × {item.quantity}
                        </div>
                      ))}
                      {order.items.length>2 && (
                        <div>+{order.items.length-2} more</div>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status==='paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status==='shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={()=>handleDelete(order._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No recent orders</p>}
      </div>
    </div>
  );
};

export default Dashboard;
