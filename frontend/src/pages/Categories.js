import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'both',
    color: '#3498db',
    icon: 'category',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        type: 'both',
        color: '#3498db',
        icon: 'category',
      });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    });
    setShowForm(true);
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      alert('Cannot delete default categories');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        fetchCategories();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'both',
      color: '#3498db',
      icon: 'category',
    });
    setError(null);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'income': return 'Income Only';
      case 'expense': return 'Expense Only';
      case 'both': return 'Both';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income': return 'text-green-600 bg-green-100';
      case 'expense': return 'text-red-600 bg-red-100';
      case 'both': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const predefinedColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
    '#64748b', '#6b7280', '#374151', '#1f2937', '#111827'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <span className="material-icons">add</span>
            Add Category
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {/* Category Form */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="form-input"
                placeholder="Enter category name"
              />
            </div>

            {/* Category Type */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span className={`text-center ${formData.type === 'income' ? 'text-green-600' : 'text-gray-600'}`}>
                    <span className="material-icons block mb-1">add</span>
                    <span className="text-sm font-medium">Income Only</span>
                  </span>
                </label>
                <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span className={`text-center ${formData.type === 'expense' ? 'text-red-600' : 'text-gray-600'}`}>
                    <span className="material-icons block mb-1">remove</span>
                    <span className="text-sm font-medium">Expense Only</span>
                  </span>
                </label>
                <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="type"
                    value="both"
                    checked={formData.type === 'both'}
                    onChange={handleFormChange}
                    className="sr-only"
                  />
                  <span className={`text-center ${formData.type === 'both' ? 'text-blue-600' : 'text-gray-600'}`}>
                    <span className="material-icons block mb-1">swap_vert</span>
                    <span className="text-sm font-medium">Both</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>

            {/* Icon */}
            <div className="form-group">
              <label htmlFor="icon" className="form-label">Icon (Material Icon Name)</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleFormChange}
                className="form-input"
                placeholder="category"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use Material Icons names (e.g., restaurant, shopping_cart, home, etc.)
              </p>
            </div>

            {/* Preview */}
            <div className="form-group">
              <label className="form-label">Preview</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: formData.color + '20' }}
                >
                  <span 
                    className="material-icons"
                    style={{ color: formData.color }}
                  >
                    {formData.icon}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.name || 'Category Name'}</p>
                  <p className="text-sm text-gray-500">{getTypeLabel(formData.type)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex-1"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <span className="material-icons">save</span>
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {!showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Categories ({categories.length})</h2>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-icons text-6xl mb-4 block">category</span>
              <p className="text-lg mb-2">No categories found</p>
              <p className="text-sm">Create your first category to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <span 
                          className="material-icons"
                          style={{ color: category.color }}
                        >
                          {category.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(category.type)}`}>
                          {getTypeLabel(category.type)}
                        </span>
                      </div>
                    </div>
                    
                    {category.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                        <span className="material-icons text-xs mr-1">star</span>
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      <span className="material-icons text-sm">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.isDefault)}
                      disabled={category.isDefault}
                      className="btn btn-danger btn-sm flex-1"
                    >
                      <span className="material-icons text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
