import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, filterStatus]);

  const fetchAllOrders = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      setAllOrders(orders.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (filterStatus === 'all') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => 
        filterStatus === 'pending' ? order.paymentStatus === 'Pending' || order.status === 'Processing' :
        filterStatus === 'paid' ? order.paymentStatus === 'Paid' :
        filterStatus === 'completed' ? order.status === 'Completed' || order.status === 'Delivered' :
        order.status === filterStatus
      ));
    }
  };

  const updateOrderStatus = (orderId, newStatus, newPaymentStatus = null) => {
    const updatedOrders = allOrders.map(order => {
      if (order.id === orderId) {
        const updated = { ...order, status: newStatus };
        if (newPaymentStatus) {
          updated.paymentStatus = newPaymentStatus;
        }
        return updated;
      }
      return order;
    });
    
    setAllOrders(updatedOrders);
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pending':
        return 'text-orange-600 bg-orange-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getOrderStats = () => {
    const total = allOrders.length;
    const pending = allOrders.filter(o => o.paymentStatus === 'Pending' || o.status === 'Processing').length;
    const completed = allOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
    const totalRevenue = allOrders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0);
    
    return { total, pending, completed, totalRevenue };
  };

  const confirmAction = (action, orderId, callback) => {
    const confirmMessages = {
      'Mark Paid': 'Are you sure you want to mark this order as paid?',
      'Complete': 'Are you sure you want to mark this order as completed?',
      'Mark Delivered': 'Are you sure you want to mark this order as delivered?',
      'Cancel': 'Are you sure you want to cancel this order? This action cannot be undone.'
    };

    if (window.confirm(confirmMessages[action])) {
      callback();
    }
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome, <strong>{user.displayName || user.email}</strong>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-blue-600">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-yellow-600">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-green-600">Completed Orders</h3>
          <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-purple-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-900">RM {stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'paid', 'completed'].map(filter => (
          <button
            key={filter}
            onClick={() => setFilterStatus(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === filter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          {item.service} - RM {item.price}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    RM {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-y-1">
                    {order.paymentStatus === 'Pending' && (
                      <button
                        onClick={() => confirmAction('Mark Paid', order.id, () => 
                          updateOrderStatus(order.id, order.status, 'Paid')
                        )}
                        className="block w-full px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Mark Paid
                      </button>
                    )}
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => confirmAction('Complete', order.id, () => 
                          updateOrderStatus(order.id, 'Completed')
                        )}
                        className="block w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Complete
                      </button>
                    )}
                    {order.status === 'Completed' && (
                      <button
                        onClick={() => confirmAction('Mark Delivered', order.id, () => 
                          updateOrderStatus(order.id, 'Delivered')
                        )}
                        className="block w-full px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                      >
                        Mark Delivered
                      </button>
                    )}
                    <button
                      onClick={() => confirmAction('Cancel', order.id, () => 
                        updateOrderStatus(order.id, 'Cancelled')
                      )}
                      className="block w-full px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;