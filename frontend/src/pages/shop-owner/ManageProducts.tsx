import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../components/navigation/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Search, Trash2, Edit, Sparkles, Upload, X, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  company: string;
  category: string;
  price: number;
  stock_quantity: number;
}

export const ManageProducts: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    company: '',
    category: 'Fertilizer',
    price: '',
    stock_quantity: ''
  });

  // Scan Bill state variables
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanningState, setScanningState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [scannedFileName, setScannedFileName] = useState('');
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [scanErrorMessage, setScanErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannedFileName(file.name);
    setShowScanModal(true);
    setScanningState('uploading');
    setScanErrorMessage('');
    setScanResults([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result as string;
        if (!base64Data) {
          throw new Error('Failed to read file contents');
        }

        setScanningState('processing');

        const response = await axios.post('/api/shop/scan-bill', {
          billImage: base64Data,
          mimeType: file.type
        });

        setScanResults(response.data.products || []);
        setScanningState('success');
        toast.success(response.data.message || 'Bill scanned successfully!');
        fetchProducts();
      } catch (err: any) {
        console.error('Scan error:', err);
        setScanningState('error');
        setScanErrorMessage(err.response?.data?.error || err.message || 'Failed to scan the bill. Please try again.');
        toast.error('Bill scanning failed');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setScanningState('error');
      setScanErrorMessage('Could not read the selected image file.');
      toast.error('File reading failed');
    };

    reader.readAsDataURL(file);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/shop/products');
      setProducts(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/shop/products', {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity)
      });
      toast.success('Product added successfully!');
      setShowAddForm(false);
      setForm({ name: '', company: '', category: 'Fertilizer', price: '', stock_quantity: '' });
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/shop/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Manage Inventory</h1>
            <p className="text-gray-500 mt-1">Add or update your shop products.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={triggerFileSelect}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-amber-400/20"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span>Scan Bill / बिल स्कॅन करा</span>
            </button>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {showAddForm ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Product</>}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" required value={form.name} onChange={handleInputChange} placeholder="e.g. Urea 46%" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Brand</label>
                <input type="text" name="company" required value={form.company} onChange={handleInputChange} placeholder="e.g. IFFCO" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary">
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Fungicide">Fungicide</option>
                  <option value="Insecticide">Insecticide</option>
                  <option value="Seeds">Seeds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input type="number" name="price" required min="0" step="0.01" value={form.price} onChange={handleInputChange} placeholder="e.g. 500" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" name="stock_quantity" required min="0" value={form.stock_quantity} onChange={handleInputChange} placeholder="e.g. 50" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-sm">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.company}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{product.category}</span>
                      </td>
                      <td className="p-4 font-semibold">₹{product.price}</td>
                      <td className="p-4">
                        <span className={`font-bold ${product.stock_quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No products added yet</h3>
              <p className="text-gray-500 mt-1">Start by adding your fertilizers, pesticides, and seeds.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File input for scan bill */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* AI Scan Bill Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                AI Bill Scanner (बिल स्कॅन रिपोर्ट)
              </h3>
              <button 
                onClick={() => setShowScanModal(false)}
                disabled={scanningState === 'uploading' || scanningState === 'processing'}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-150 rounded-lg transition-all disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanning States */}
            {(scanningState === 'uploading' || scanningState === 'processing') && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Upload className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-2xl animate-ping opacity-25"></div>
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-800">
                    {scanningState === 'uploading' ? 'Reading invoice image...' : 'AI is parsing products & stocks...'}
                  </h4>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs truncate">
                    File: {scannedFileName}
                  </p>
                </div>
                <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-emerald-600 transition-all duration-700 ${
                      scanningState === 'uploading' ? 'w-1/3' : 'w-3/4'
                    }`}
                  ></div>
                </div>
                <div className="space-y-1 text-slate-500 font-medium">
                  <p className={`text-xs font-bold transition-all ${scanningState === 'uploading' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    • Uploading and encoding image
                  </p>
                  <p className={`text-xs font-bold transition-all ${scanningState === 'processing' ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`}>
                    • Gemini API digitizing invoice products
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    • Synchronizing inventory stock quantities
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {scanningState === 'error' && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                  <X className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-red-600">Scan Failed</h4>
                  <p className="text-slate-500 text-sm mt-2 max-w-md">
                    {scanErrorMessage || 'Something went wrong while scanning the bill. Please check your internet connection and verify that the file is a valid image.'}
                  </p>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={triggerFileSelect}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Try Another File
                  </button>
                  <button
                    onClick={() => setShowScanModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {scanningState === 'success' && (
              <div className="p-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800">Scan Successful!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Gemini processed the dealer bill. Stock details are synchronized.
                    </p>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto border border-slate-100 rounded-2xl mb-6">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-xs">
                        <th className="py-2.5 px-4">Item Name</th>
                        <th className="py-2.5 px-4">Company</th>
                        <th className="py-2.5 px-4">Qty Added</th>
                        <th className="py-2.5 px-4">New Stock Qty</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {scanResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-4">{item.company}</td>
                          <td className="py-2.5 px-4 font-bold text-emerald-600">+{item.quantity}</td>
                          <td className="py-2.5 px-4">
                            {item.newQty !== undefined ? `${item.newQty} units` : `${item.quantity} units`}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {item.status === 'updated' ? (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                Incremented
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                New Product
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowScanModal(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
