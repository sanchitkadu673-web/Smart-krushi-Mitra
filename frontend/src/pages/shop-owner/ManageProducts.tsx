import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../components/navigation/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Search, Trash2, Edit } from 'lucide-react';
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          >
            {showAddForm ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Product</>}
          </button>
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
    </div>
  );
};
