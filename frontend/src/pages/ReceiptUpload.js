import React, { useState } from 'react';
import { receiptAPI, transactionAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currency';

const ReceiptUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState(null);

  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setExtractedData(null);
    } else {
      setError('Please select a valid image (JPEG, PNG, GIF) or PDF file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadReceipt = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append('receipt', selectedFile);

      const response = await receiptAPI.upload(formData);
      
      setResult(response);
      setExtractedData(response.data.transaction);
      setEditedTransaction({ ...response.data.transaction });

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleTransactionEdit = (field, value) => {
    setEditedTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveTransaction = async () => {
    try {
      setProcessing(true);
      setError(null);

      await transactionAPI.update(extractedData._id, editedTransaction);
      
      setResult(prev => ({
        ...prev,
        message: 'Transaction updated successfully!'
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };



  const reset = () => {
    setSelectedFile(null);
    setResult(null);
    setExtractedData(null);
    setEditedTransaction(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Receipt Upload</h1>
        {result && (
          <button onClick={reset} className="btn btn-outline">
            <span className="material-icons">refresh</span>
            Upload Another
          </button>
        )}
      </div>

      {/* Upload Area */}
      {!result && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upload Receipt</h2>
            <p className="text-gray-600 mt-2">
              Upload an image or PDF of your receipt to automatically extract transaction details.
            </p>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="material-icons text-green-600 text-2xl">
                      {selectedFile.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={uploadReceipt}
                    disabled={uploading}
                    className="btn btn-primary"
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">upload</span>
                        Process Receipt
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="btn btn-outline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <span className="material-icons text-gray-600 text-3xl">cloud_upload</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your receipt here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, GIF, and PDF files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                  <span className="material-icons">add_photo_alternate</span>
                  Select File
                </label>
              </div>
            )}
          </div>

          {/* Processing Status */}
          {processing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <div>
                  <p className="font-medium text-blue-900">Processing receipt...</p>
                  <p className="text-sm text-blue-700">
                    Extracting text and analyzing transaction data. This may take a few moments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="alert alert-success">
          <span className="material-icons">check_circle</span>
          {result.message}
        </div>
      )}

      {/* Extracted Data & Edit Form */}
      {extractedData && editedTransaction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipt Preview */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Receipt Preview</h2>
            </div>
            <div className="space-y-4">
              {result?.data?.fileName && (
                <div className="border rounded-lg overflow-hidden">
                  {selectedFile?.type === 'application/pdf' ? (
                    <div className="bg-gray-100 p-8 text-center">
                      <span className="material-icons text-4xl text-gray-600 mb-2 block">
                        picture_as_pdf
                      </span>
                      <p className="text-gray-600">PDF Receipt</p>
                      <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/receipts/${result.data.fileName}`}
                      alt="Receipt"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  )}
                </div>
              )}
              
              {/* Extracted Text */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Extracted Text:</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {result?.data?.extractedText || 'No text extracted'}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Editor */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Transaction Details</h2>
              <p className="text-gray-600 mt-1">
                Review and edit the extracted transaction information
              </p>
            </div>

            <form className="space-y-4">
              {/* Transaction Type */}
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={editedTransaction.type === 'income'}
                      onChange={(e) => handleTransactionEdit('type', e.target.value)}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <span className="material-icons text-green-600 mr-1">add</span>
                      Income
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={editedTransaction.type === 'expense'}
                      onChange={(e) => handleTransactionEdit('type', e.target.value)}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <span className="material-icons text-red-600 mr-1">remove</span>
                      Expense
                    </span>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  value={editedTransaction.amount}
                  onChange={(e) => handleTransactionEdit('amount', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={editedTransaction.description}
                  onChange={(e) => handleTransactionEdit('description', e.target.value)}
                  className="form-input"
                  placeholder="Transaction description"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={editedTransaction.category}
                  onChange={(e) => handleTransactionEdit('category', e.target.value)}
                  className="form-input"
                  placeholder="Category"
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={new Date(editedTransaction.date).toISOString().split('T')[0]}
                  onChange={(e) => handleTransactionEdit('date', new Date(e.target.value))}
                  className="form-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={saveTransaction}
                  disabled={processing}
                  className="btn btn-primary flex-1"
                >
                  {processing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="material-icons">save</span>
                      Update Transaction
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!result && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-3">
                <span className="material-icons text-blue-600 text-2xl">upload_file</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Upload Receipt</h3>
              <p className="text-sm text-gray-600">
                Upload a clear image or PDF of your receipt. Make sure the text is readable.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-3">
                <span className="material-icons text-blue-600 text-2xl">auto_fix_high</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. AI Processing</h3>
              <p className="text-sm text-gray-600">
                Our AI extracts text and automatically identifies transaction details like amount and date.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-3">
                <span className="material-icons text-blue-600 text-2xl">edit</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Review & Save</h3>
              <p className="text-sm text-gray-600">
                Review the extracted information, make any necessary edits, and save to your transactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
