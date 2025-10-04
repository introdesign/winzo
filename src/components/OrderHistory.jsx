import React, { useState, useEffect } from 'react';

const OrderHistory = ({ user, refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from localStorage
    const fetchOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const userOrders = allOrders
          .filter(order => order.userId === user.uid)
          .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)); // Sort by newest first
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, refreshTrigger]); // Add refreshTrigger as dependency

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading order history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Order & Payment History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No orders found.</p>
          <p className="text-gray-400">Start placing orders to see your history here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, orderIndex) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">Date: {order.date}</p>
                  <p className="text-sm text-gray-500">Order #{orderIndex + 1}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items ({order.items.length}):</h4>
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                      <div>
                        <span className="font-medium">{item.service}</span>
                        <span className="text-sm text-gray-500 ml-2">#{itemIndex + 1}</span>
                        {item.length && item.width && (
                          <span className="text-gray-600 ml-2">
                            ({item.length}ft x {item.width}ft)
                          </span>
                        )}
                        {item.area && item.area !== "-" && (
                          <span className="text-gray-600 ml-2">
                            (Area: {item.area} sq ft)
                          </span>
                        )}
                      </div>
                      <span className="font-medium">RM {item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-gray-600">Payment Method: </span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">Total: RM {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Orders: </span>
              <span className="font-medium">{orders.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Spent: </span>
              <span className="font-medium">
                RM {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Paid Orders: </span>
              <span className="font-medium">
                {orders.filter(order => order.paymentStatus === 'Paid').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pending Payments: </span>
              <span className="font-medium">
                {orders.filter(order => order.paymentStatus === 'Pending').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;