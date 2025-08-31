import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { transactionAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currency';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const response = await transactionAPI.getStats(params);
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  // Prepare chart data
  const expensesByCategoryData = {
    labels: stats?.expensesByCategory?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Amount Spent',
        data: stats?.expensesByCategory?.map(item => item.total) || [],
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
          '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const dailyTrendsData = {
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Expenses',
        data: [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // Process daily totals for line chart
  if (stats?.dailyTotals) {
    const groupedByDate = {};
    
    stats.dailyTotals.forEach(item => {
      const date = item._id.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = { income: 0, expense: 0 };
      }
      groupedByDate[date][item._id.type] = item.total;
    });

    const sortedDates = Object.keys(groupedByDate).sort();
    dailyTrendsData.labels = sortedDates;
    dailyTrendsData.datasets[0].data = sortedDates.map(date => groupedByDate[date].income);
    dailyTrendsData.datasets[1].data = sortedDates.map(date => groupedByDate[date].expense);
  }

  const monthlyComparisonData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [stats?.totals?.income || 0, stats?.totals?.expense || 0],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span className="material-icons">error</span>
        Error loading analytics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Date Range Filter */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Date Range</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              className="btn btn-outline w-full"
            >
              Clear Dates
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.totals?.income || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="material-icons text-green-600">trending_up</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats?.totals?.expense || 0)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="material-icons text-red-600">trending_down</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${
                (stats?.totals?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(stats?.totals?.balance || 0)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              (stats?.totals?.balance || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`material-icons ${
                (stats?.totals?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                account_balance_wallet
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.totals?.income > 0 
                  ? Math.round(((stats.totals.income - stats.totals.expense) / stats.totals.income) * 100)
                  : 0
                }%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="material-icons text-blue-600">savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category (Pie Chart) */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Expenses by Category</h2>
          </div>
          <div className="h-80">
            {stats?.expensesByCategory && stats.expensesByCategory.length > 0 ? (
              <Pie data={expensesByCategoryData} options={pieChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <span className="material-icons text-4xl mb-2 block">pie_chart</span>
                  <p>No expense data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Income vs Expenses (Bar Chart) */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Income vs Expenses</h2>
          </div>
          <div className="h-80">
            <Bar data={monthlyComparisonData} options={chartOptions} />
          </div>
        </div>

        {/* Daily Trends (Line Chart) */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Daily Trends (Last 30 Days)</h2>
          </div>
          <div className="h-80">
            {dailyTrendsData.labels.length > 0 ? (
              <Line data={dailyTrendsData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <span className="material-icons text-4xl mb-2 block">show_chart</span>
                  <p>No daily trend data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Categories Table */}
      {stats?.expensesByCategory && stats.expensesByCategory.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Expense Categories</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 font-semibold">Transactions</th>
                  <th className="text-right py-3 px-4 font-semibold">Total Amount</th>
                  <th className="text-right py-3 px-4 font-semibold">Average</th>
                  <th className="text-right py-3 px-4 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.expensesByCategory.map((category, index) => {
                  const percentage = stats.totals.expense > 0 
                    ? (category.total / stats.totals.expense) * 100 
                    : 0;
                  const average = category.total / category.count;
                  
                  return (
                    <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ 
                              backgroundColor: expensesByCategoryData.datasets[0].backgroundColor[index % 10] 
                            }}
                          ></div>
                          <span className="font-medium">{category._id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {category.count}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">
                        {formatCurrency(category.total)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {formatCurrency(average)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {percentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
