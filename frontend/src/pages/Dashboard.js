import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics
      const statsResponse = await transactionAPI.getStats();
      setStats(statsResponse.data);

      // Fetch recent transactions (last 5)
      const transactionsResponse = await transactionAPI.getAll({
        limit: 5,
        sortBy: 'date',
        sortOrder: 'desc'
      });
      setRecentTransactions(transactionsResponse.data.transactions);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          to="/transactions" 
          className="btn btn-primary"
        >
          <span className="material-icons">add</span>
          Add Transaction
        </Link>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
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

        {/* Total Expenses */}
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

        {/* Net Balance */}
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
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/transactions" className="btn btn-outline flex-col py-4">
            <span className="material-icons text-2xl mb-2">add_circle</span>
            Add Transaction
          </Link>
          <Link to="/receipts" className="btn btn-outline flex-col py-4">
            <span className="material-icons text-2xl mb-2">upload_file</span>
            Upload Receipt
          </Link>
          <Link to="/categories" className="btn btn-outline flex-col py-4">
            <span className="material-icons text-2xl mb-2">category</span>
            Manage Categories
          </Link>
          <Link to="/analytics" className="btn btn-outline flex-col py-4">
            <span className="material-icons text-2xl mb-2">analytics</span>
            View Analytics
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="card-title">Recent Transactions</h2>
          <Link to="/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="material-icons text-4xl mb-2 block">receipt_long</span>
            No transactions yet. Start by adding your first transaction!
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction._id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={`material-icons text-sm ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? 'add' : 'remove'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Expense Categories */}
      {stats?.expensesByCategory && stats.expensesByCategory.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Expense Categories</h2>
          </div>
          <div className="space-y-3">
            {stats.expensesByCategory.slice(0, 5).map((category) => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{category._id}</span>
                  <span className="text-sm text-gray-500">({category.count} transactions)</span>
                </div>
                <span className="font-semibold text-red-600">
                  {formatCurrency(category.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
