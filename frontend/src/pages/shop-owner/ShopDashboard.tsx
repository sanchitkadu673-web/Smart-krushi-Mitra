import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../components/navigation/Navbar';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Package, 
  ShoppingCart, 
  Bell, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Building2, 
  UserPlus, 
  CheckCircle2, 
  Loader2, 
  X,
  Sparkles,
  Upload,
  Edit,
  Trash2
} from 'lucide-react';

export const ShopDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'farmers' | 'products'>('farmers');
  
  // Register Farmer Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFarmer, setNewFarmer] = useState({
    fullName: '',
    mobile: '',
    state: 'Maharashtra',
    district: '',
    taluka: '',
    village: ''
  });

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan Bill state variables
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanningState, setScanningState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [scannedFileName, setScannedFileName] = useState('');
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [scanErrorMessage, setScanErrorMessage] = useState('');

  // Edit Product Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    category: 'Fertilizer',
    price: '',
    stock_quantity: ''
  });

  const fetchData = async () => {
    try {
      const [shopRes, productsRes, farmersRes] = await Promise.all([
        axios.get('/api/shop/me'),
        axios.get('/api/shop/products'),
        axios.get('/api/shop/farmers')
      ]);
      setShop(shopRes.data);
      setProducts(productsRes.data || []);
      setFarmers(farmersRes.data || []);
    } catch (err) {
      toast.error('Failed to load shop/dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        setActiveTab('products');
        toast.success(response.data.message || 'Bill scanned successfully!');
        fetchData();
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

  const handleStartEdit = (p: any) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      company: p.company || '',
      category: p.category || 'Fertilizer',
      price: p.price.toString(),
      stock_quantity: p.stock_quantity.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdatingProduct(true);
    try {
      await axios.put(`/api/shop/products/${editingProduct.id}`, {
        name: editForm.name,
        company: editForm.company,
        category: editForm.category,
        price: parseFloat(editForm.price) || 0,
        stock_quantity: parseInt(editForm.stock_quantity) || 0
      });
      toast.success('Product updated successfully!');
      setShowEditModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update product');
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product from stock?')) return;
    try {
      await axios.delete(`/api/shop/products/${id}`);
      toast.success('Product deleted successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete product');
    }
  };


  const handleRegisterFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(newFarmer.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post('/api/shop/farmers', newFarmer);
      toast.success(response.data.message || 'Farmer registered successfully!');
      setShowAddModal(false);
      setNewFarmer({
        fullName: '',
        mobile: '',
        state: 'Maharashtra',
        district: '',
        taluka: '',
        village: ''
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to register farmer');
    } finally {
      setRegistering(false);
    }
  };

  const lowStockCount = products.filter(p => p.stock_quantity <= 10).length;

  // Filter lists based on search
  const filteredFarmers = farmers.filter(f => 
    f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.mobile.includes(searchQuery) || 
    f.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading Shop Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white">
                <Building2 className="w-7 h-7" />
              </span>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {shop?.shop_name || 'My Krushi Seva Kendra'}
              </h1>
            </div>
            <p className="text-emerald-100 mt-2 font-medium flex items-center gap-1.5 text-sm md:text-base">
              <MapPin className="w-4 h-4 shrink-0" /> {shop?.address || 'Address not registered'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={triggerFileSelect}
              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm border border-amber-400/30"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              Scan Bill (बिल स्कॅन करा)
            </button>
            <button 
              onClick={() => navigate('/shop/products')}
              className="bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
            >
              <Package className="w-4 h-4" />
              Manage Products
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm border border-emerald-400/30"
            >
              <UserPlus className="w-4 h-4" />
              Add Farmer (शेतकरी जोडा)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 -mt-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-black text-slate-800">{products.length}</h3>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
              <h3 className="text-2xl font-black text-slate-800">{lowStockCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Farmers</p>
              <h3 className="text-2xl font-black text-slate-800">{farmers.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shop Status</p>
              <h3 className={`text-sm font-extrabold ${shop?.is_approved ? 'text-green-600' : 'text-amber-500'}`}>
                {shop?.is_approved ? 'Approved / सक्रीय' : 'Pending Approval'}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => { setActiveTab('farmers'); setSearchQuery(''); }}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === 'farmers' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                Linked Farmers ({farmers.length})
              </button>
              <button
                onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === 'products' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                Inventory Stock ({products.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'farmers' ? "Search farmer name, village..." : "Search product name, category..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'farmers' ? (
            <div>
              {filteredFarmers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
                  <h4 className="text-lg font-bold text-slate-700">No linked farmers found</h4>
                  <p className="text-slate-500 mt-1 max-w-md mx-auto text-sm">
                    {searchQuery ? "No farmers match your search criteria." : "Register your local farmers (शेतकरी) so they can view your stock and get notifications."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Farmer Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFarmers.map(farmer => (
                    <div key={farmer.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:border-emerald-200 transition-all flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{farmer.full_name}</h4>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          Farmer (शेतकरी)
                        </span>
                        
                        <div className="mt-4 space-y-1 text-sm text-slate-500 font-medium">
                          <p className="flex items-center gap-1.5">
                            <span className="text-slate-400">Mobile:</span> +91 {farmer.mobile}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="text-slate-400">Location:</span> {farmer.village}, {farmer.taluka}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center text-xs text-slate-400">
                        <span>Joined: {new Date(farmer.created_at).toLocaleDateString()}</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active Link
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
                  <h4 className="text-lg font-bold text-slate-700">No products found</h4>
                  <p className="text-slate-500 mt-1 text-sm">
                    {searchQuery ? "No products match your search query." : "You haven't added any products to your inventory yet."}
                  </p>
                  <button
                    onClick={() => navigate('/shop/products')}
                    className="mt-4 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Go to Stock Management
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-xs">
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock Qty</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                          <td className="py-3.5 px-4">{p.company}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">₹{p.price}</td>
                          <td className="py-3.5 px-4 font-bold">{p.stock_quantity} bags/units</td>
                          <td className="py-3.5 px-4">
                            {p.stock_quantity <= 0 ? (
                              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-xs font-bold">Out of Stock</span>
                            ) : p.stock_quantity <= 10 ? (
                              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold">Low Stock</span>
                            ) : (
                              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs font-bold">In Stock</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="text-slate-400 hover:text-emerald-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                                title="Edit Entry"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Register Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Register New Farmer (नवीन शेतकरी नोंदणी)
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-150 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterFarmer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name (पूर्ण नाव)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kadam"
                  value={newFarmer.fullName}
                  onChange={e => setNewFarmer({ ...newFarmer, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mobile Number (मोबाईल नंबर)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={newFarmer.mobile}
                    onChange={e => setNewFarmer({ ...newFarmer, mobile: e.target.value })}
                    className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    State (राज्य)
                  </label>
                  <input
                    type="text"
                    required
                    value={newFarmer.state}
                    onChange={e => setNewFarmer({ ...newFarmer, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    District (जिल्हा)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={newFarmer.district}
                    onChange={e => setNewFarmer({ ...newFarmer, district: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Taluka (तालुका)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haveli"
                    value={newFarmer.taluka}
                    onChange={e => setNewFarmer({ ...newFarmer, taluka: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Village (गाव)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manjri"
                    value={newFarmer.village}
                    onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Farmer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <div className="space-y-1">
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

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                Edit Product Entry (उत्पादन दुरुस्त करा)
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-150 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Product Name (नाव)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urea 46%"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Company Brand (कंपनी)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IFFCO"
                  value={editForm.company}
                  onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category (वर्ग)
                </label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Fungicide">Fungicide</option>
                  <option value="Insecticide">Insecticide</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Price (₹) (दर)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g. 500"
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Stock Quantity (शिल्लक स्टॉक)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 50"
                    value={editForm.stock_quantity}
                    onChange={e => setEditForm({ ...editForm, stock_quantity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProduct}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                  {updatingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ShopDashboard;

