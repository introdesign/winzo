import React, { useState, useEffect } from 'react';

const RevenueDashboard = ({ user }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [revenueData, setRevenueData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    calculateRevenue();
  }, [allOrders, selectedPeriod]);

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

  const calculateRevenue = () => {
    const paidOrders = allOrders.filter(order => order.paymentStatus === 'Paid');
    const pendingOrders = allOrders.filter(order => order.paymentStatus === 'Pending');
    
    // Filter by period
    let filteredOrders = paidOrders;
    const now = new Date();
    
    if (selectedPeriod === 'today') {
      filteredOrders = paidOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = paidOrders.filter(order => new Date(order.date) >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredOrders = paidOrders.filter(order => new Date(order.date) >= monthAgo);
    }

    // Calculate service-wise revenue and costs
    const serviceRevenue = {};
    const serviceCosts = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const revenue = parseFloat(item.price);
        const cost = revenue * 0.6; // Assume 60% cost ratio
        
        if (serviceRevenue[item.service]) {
          serviceRevenue[item.service].revenue += revenue;
          serviceRevenue[item.service].cost += cost;
          serviceRevenue[item.service].count += 1;
        } else {
          serviceRevenue[item.service] = {
            revenue: revenue,
            cost: cost,
            count: 1
          };
        }
      });
    });

    // Calculate monthly revenue for the last 6 months
    const monthlyRevenue = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyRevenue[monthKey] = { revenue: 0, cost: 0 };
    }

    paidOrders.forEach(order => {
      const orderDate = new Date(order.date);
      const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyRevenue[monthKey]) {
        const revenue = order.total;
        const cost = revenue * 0.6; // 60% cost
        monthlyRevenue[monthKey].revenue += revenue;
        monthlyRevenue[monthKey].cost += cost;
      }
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalCost = totalRevenue * 0.6; // 60% cost
    const profit = totalRevenue - totalCost;

    setRevenueData({
      totalRevenue,
      totalCost,
      profit,
      totalOrders: filteredOrders.length,
      averageOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
      pendingRevenue: pendingOrders.reduce((sum, order) => sum + order.total, 0),
      serviceRevenue,
      monthlyRevenue,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
    });
  };

  // Simple Pie Chart Component
  const PieChart = ({ data, title }) => {
    const total = Object.values(data).reduce((sum, item) => sum + item.revenue, 0);
    let cumulativeAngle = 0;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    return (
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center">
          <div className="relative w-48 h-48">
            <svg width="192" height="192" className="transform -rotate-90">
              {Object.entries(data).map(([service, item], index) => {
                const percentage = (item.revenue / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = cumulativeAngle;
                cumulativeAngle += angle;

                const startX = 96 + 80 * Math.cos((startAngle * Math.PI) / 180);
                const startY = 96 + 80 * Math.sin((startAngle * Math.PI) / 180);
                const endX = 96 + 80 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                const endY = 96 + 80 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                const largeArcFlag = angle > 180 ? 1 : 0;

                return (
                  <path
                    key={service}
                    d={`M 96 96 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          <div className="ml-6">
            {Object.entries(data).map(([service, item], index) => (
              <div key={service} className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm">
                  {service}: RM {item.revenue.toFixed(2)} 
                  ({((item.revenue / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Simple Bar Chart Component
  const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data).map(item => Math.max(item.revenue, item.cost)));

    return (
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          {Object.entries(data).map(([month, values]) => (
            <div key={month} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{month}</span>
                <span>Revenue: RM {values.revenue.toFixed(2)} | Cost: RM {values.cost.toFixed(2)}</span>
              </div>
              <div className="relative">
                <div className="flex space-x-1">
                  <div 
                    className="bg-blue-500 h-6 rounded"
                    style={{ width: `${(values.revenue / maxValue) * 100}%`, minWidth: '2px' }}
                    title={`Revenue: RM ${values.revenue.toFixed(2)}`}
                  ></div>
                  <div 
                    className="bg-red-400 h-6 rounded"
                    style={{ width: `${(values.cost / maxValue) * 100}%`, minWidth: '2px' }}
                    title={`Cost: RM ${values.cost.toFixed(2)}`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center space-x-4 text-sm pt-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
              <span>Cost</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading revenue dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Revenue Dashboard</h2>
        <div className="text-sm text-gray-600">
          Admin: <strong>{ user.email}</strong>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'today', 'week', 'month'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedPeriod === period
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-900">RM {revenueData.totalRevenue?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-600 mb-2">Total Cost</h3>
          <p className="text-2xl font-bold text-red-900">RM {revenueData.totalCost?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-600 mb-2">Net Profit</h3>
          <p className="text-2xl font-bold text-blue-900">RM {revenueData.profit?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-600 mb-2">Profit Margin</h3>
          <p className="text-2xl font-bold text-purple-900">{revenueData.profitMargin?.toFixed(1) || '0.0'}%</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-sm font-medium text-orange-600 mb-2">Avg Order Value</h3>
          <p className="text-2xl font-bold text-orange-900">RM {revenueData.averageOrderValue?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Service Revenue Pie Chart */}
        {revenueData.serviceRevenue && Object.keys(revenueData.serviceRevenue).length > 0 && (
          <PieChart 
            data={revenueData.serviceRevenue} 
            title="Revenue by Service" 
          />
        )}

        {/* Monthly Revenue vs Cost Bar Chart */}
        {revenueData.monthlyRevenue && Object.keys(revenueData.monthlyRevenue).length > 0 && (
          <BarChart 
            data={revenueData.monthlyRevenue} 
            title="Monthly Revenue vs Cost (Last 6 Months)" 
          />
        )}
      </div>

      {/* Detailed Service Analysis */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Service Profitability Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(revenueData.serviceRevenue || {})
                .sort(([,a], [,b]) => (b.revenue - b.cost) - (a.revenue - a.cost))
                .map(([service, data]) => {
                  const profit = data.revenue - data.cost;
                  const margin = (profit / data.revenue) * 100;
                  return (
                    <tr key={service} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.count}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        RM {data.revenue.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        RM {data.cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        RM {profit.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`${margin > 30 ? 'text-green-600' : margin > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {(!revenueData.serviceRevenue || Object.keys(revenueData.serviceRevenue).length === 0) && (
          <div className="text-center py-4 text-gray-500">No revenue data available</div>
        )}
      </div>
    </div>
  );
};

export default RevenueDashboard;