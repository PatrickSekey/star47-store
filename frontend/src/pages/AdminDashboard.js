import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch dashboard data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const response = await fetch(`${API_URL}/admin/stats`);
        const data = await response.json();
        if (data.success) setStats(data.stats);
      } else if (activeTab === 'customers') {
        const response = await fetch(`${API_URL}/admin/customers`);
        const data = await response.json();
        if (data.success) setCustomers(data.customers);
      } else if (activeTab === 'orders') {
        const response = await fetch(`${API_URL}/admin/orders`);
        const data = await response.json();
        if (data.success) setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      paid: '#28a745',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#6f42c1',
      cancelled: '#dc3545',
      refunded: '#fd7e14'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>⭐ STAR47 Admin Dashboard</h1>
        <p>Manage customers, orders, and track sales</p>
      </header>

      <div className="admin-tabs">
        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
          📊 Stats
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          📦 Orders
        </button>
        <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>
          👥 Customers
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Loading...</div>}

        {/* Stats Dashboard */}
        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.totalCustomers}</div>
              <div className="stat-label">Total Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.paidOrders}</div>
              <div className="stat-label">Paid Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-value">{stats.shippedOrders}</div>
              <div className="stat-label">Shipped</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{stats.deliveredOrders}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="orders-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerEmail}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Customers Table */}
        {activeTab === 'customers' && (
          <div className="customers-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Orders</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer._id}>
                    <td>{customer.firstName} {customer.lastName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address?.city}, {customer.address?.state}</td>
                    <td>{customer.orders?.length || 0}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <p><strong>Order #:</strong> {selectedOrder.orderNumber}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerEmail}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
            
            <h3>Items</h3>
            <table className="items-table">
              <thead>
                <tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th></tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productName}</td>
                    <td>{item.sizeRoman}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h3>Update Status</h3>
            <div className="status-buttons">
              {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  className="status-update-btn"
                  style={{ backgroundColor: getStatusColor(status) }}
                  onClick={() => updateOrderStatus(selectedOrder._id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <button className="close-modal" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;