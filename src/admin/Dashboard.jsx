import { useState, useEffect, useContext } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { productsApi, userApi } from '../api';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    avgOrderValue: 0,
    orderStatusOverview: {},
    lowStockItems: [],
    outOfStockItems: [],
    categoryDistribution: {},
    revenueData: {},
    topSellingProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState('lastWeek');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      updateRevenueData();
    }
  }, [revenuePeriod, orders]);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        fetch(`${userApi}`),
        fetch(`${productsApi}`)
      ]);

      const users = await usersResponse.json();
      const products = await productsResponse.json();

      const fetchOrders = async () => {
        try {
          const { data: users } = await axios.get(userApi);

          const allOrders = users.flatMap((user) =>
            (user.orders || []).map((order) => ({
              ...order,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
            }))
          );

          allOrders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
          setOrders(allOrders);
          return allOrders;
        } catch (err) {
          console.error("Error fetching orders:", err);
          return [];
        }
      };

      const allOrders = await fetchOrders();

      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalUsers = users.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const orderStatusOverview = {
        totalOrders: allOrders.length,
        processing: allOrders.filter(order => order.status === 'processing' || !order.status).length,
        confirmed: allOrders.filter(order => order.status === 'Confirmed').length,
        shipped: allOrders.filter(order => order.status === 'Shipped').length,
        delivered: allOrders.filter(order => order.status === 'Delivered').length,
        cancelled: allOrders.filter(order => order.status === 'Cancelled').length
      };

      const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10);
      const outOfStockItems = products.filter(p => p.stock === 0);

      const categoryDistribution = products.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const topSellingProducts = calculateTopSellingProducts(allOrders, products);

      setDashboardData(prevData => ({
        ...prevData,
        totalOrders,
        totalRevenue,
        totalUsers,
        avgOrderValue,
        orderStatusOverview,
        lowStockItems,
        outOfStockItems,
        categoryDistribution,
        topSellingProducts
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const updateRevenueData = () => {
    const revenueData = calculateRevenueData(orders, revenuePeriod);
    setDashboardData(prevData => ({
      ...prevData,
      revenueData
    }));
  };

  const calculateRevenueData = (orders, period) => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'lastWeek':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last30Days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last6Months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filteredOrders = orders.filter(order => {
      if (!order.date) return false;
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= now;
    });

    if (period === 'lastWeek') {
      const dailyRevenue = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dailyRevenue[dateString] = 0;
      }

      filteredOrders.forEach(order => {
        if (order.date) {
          const orderDate = new Date(order.date).toISOString().split('T')[0];
          dailyRevenue[orderDate] = (dailyRevenue[orderDate] || 0) + (order.total || 0);
        }
      });

      const labels = Object.keys(dailyRevenue).map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      });

      return {
        labels,
        data: Object.values(dailyRevenue),
        total: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      };

    } else if (period === 'last30Days') {
      const weeklyRevenue = {};
      
      for (let i = 3; i >= 0; i--) {
        const weekLabel = `Week ${4 - i}`;
        weeklyRevenue[weekLabel] = 0;
      }

      filteredOrders.forEach(order => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const daysAgo = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
          
          let weekNumber;
          if (daysAgo <= 7) weekNumber = 4;
          else if (daysAgo <= 14) weekNumber = 3;
          else if (daysAgo <= 21) weekNumber = 2;
          else weekNumber = 1;
          
          const weekLabel = `Week ${weekNumber}`;
          weeklyRevenue[weekLabel] = (weeklyRevenue[weekLabel] || 0) + (order.total || 0);
        }
      });

      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: Object.values(weeklyRevenue),
        total: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      };

    } else {
      const monthlyRevenue = {};
      const monthCount = 6;

      for (let i = monthCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyRevenue[monthYear] = 0;
      }

      filteredOrders.forEach(order => {
        if (order.date) {
          const date = new Date(order.date);
          const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + (order.total || 0);
        }
      });

      const labels = Object.keys(monthlyRevenue).map(month => {
        const [year, monthNum] = month.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
      });

      return {
        labels,
        data: Object.values(monthlyRevenue),
        total: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      };
    }
  };

  const calculateTopSellingProducts = (orders, products) => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
      }
    });

    return Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return product ? {
          ...product,
          totalSold: quantity,
          revenue: quantity * (product.price || 0)
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon="📦"
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toFixed(2)}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon="👥"
          color="purple"
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${dashboardData.avgOrderValue.toFixed(2)}`}
          icon="📊"
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Graph */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setRevenuePeriod('lastWeek')}
                className={`px-3 py-1 text-sm rounded-md ${
                  revenuePeriod === 'lastWeek'
                    ? 'bg-blue-950 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last Week
              </button>
              <button
                onClick={() => setRevenuePeriod('last30Days')}
                className={`px-3 py-1 text-sm rounded-md ${
                  revenuePeriod === 'last30Days'
                    ? 'bg-blue-950 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setRevenuePeriod('last6Months')}
                className={`px-3 py-1 text-sm rounded-md ${
                  revenuePeriod === 'last6Months'
                    ? 'bg-blue-950 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                6 Months
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-2xl font-bold text-green-600">
              ${dashboardData.revenueData.total?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600">
              Total revenue for {revenuePeriod === 'lastWeek' ? 'the last 7 days' : 
                              revenuePeriod === 'last30Days' ? 'the last 30 days' : 'the last 6 months'}
            </p>
          </div>

          <Line
            data={{
              labels: dashboardData.revenueData.labels || [],
              datasets: [
                {
                  label: 'Revenue ($)',
                  data: dashboardData.revenueData.data || [],
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.3,
                  fill: true,
                  pointBackgroundColor: '#10B981',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                },
                x: {
                  ticks: {
                    maxRotation: revenuePeriod === 'lastWeek' ? 45 : 0
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
          {Object.keys(dashboardData.categoryDistribution).length > 0 ? (
            <Pie
              data={{
                labels: Object.keys(dashboardData.categoryDistribution),
                datasets: [
                  {
                    data: Object.values(dashboardData.categoryDistribution),
                    backgroundColor: [
                      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280',
                      '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4', '#84CC16'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} products (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-center">No category data available</p>
            </div>
          )}
          
       
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(dashboardData.categoryDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 4)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700 truncate">{category}</span>
                  <span className="text-sm font-bold text-blue-500">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Total Orders</span>
              <span className="text-lg font-bold text-blue-500">
                {dashboardData.orderStatusOverview.totalOrders}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span className="font-medium">processing</span>
              <span className="text-lg font-bold text-yellow-600">
                {dashboardData.orderStatusOverview.processing}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="font-medium">Confirmed</span>
              <span className="text-lg font-bold text-blue-500">
                {dashboardData.orderStatusOverview.confirmed}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="font-medium">Shipped</span>
              <span className="text-lg font-bold text-purple-600">
                {dashboardData.orderStatusOverview.shipped}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="font-medium">Delivered</span>
              <span className="text-lg font-bold text-green-600">
                {dashboardData.orderStatusOverview.delivered}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span className="font-medium">Cancelled</span>
              <span className="text-lg font-bold text-red-600">
                {dashboardData.orderStatusOverview.cancelled}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {dashboardData.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{product.totalSold} sold</p>
                  <p className="text-sm text-gray-600">${product.revenue.toFixed(2)} revenue</p>
                </div>
              </div>
            ))}
            {dashboardData.topSellingProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAlertSection
          title="Low Stock Alert"
          items={dashboardData.lowStockItems}
          type="low"
          color="yellow"
        />
        
        <StockAlertSection
          title="Out of Stock"
          items={dashboardData.outOfStockItems}
          type="out"
          color="red"
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function StockAlertSection({ title, items, type, color }) {
  if (items.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 border-${color}-500 p-6`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {type === 'low' ? '⚠️' : '❌'} {title}
        <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800`}>
          {items.length} items
        </span>
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.slice(0, 10).map((product) => (
          <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded border">
            <div className="flex items-center space-x-3">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-gray-600">SKU: {product.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                type === 'low' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {type === 'low' ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        ))}
        {items.length > 10 && (
          <p className="text-sm text-gray-600 text-center mt-2">
            +{items.length - 10} more items...
          </p>
        )}
      </div>
    </div>
  );
}