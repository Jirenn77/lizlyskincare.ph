"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Image, Settings, Eye, LogIn, LogOut, Plus, Search, Filter, Edit, Trash2,
  ChevronLeft, ChevronRight, Tag, Package, CheckCircle, X, BarChart3, Shield, Bell, DollarSign, TrendingUp
 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lizlyskincare.sbs";


const ServiceModal = ({ service, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || 'Facial',
    price: service?.price || 0,
    duration: service?.duration || 60,
    is_active: service?.is_active !== undefined ? service.is_active : true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {service ? 'Edit Service' : 'Add New Service'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                required
              >
                <option value="Facial">Facial</option>
                <option value="Laser">Laser</option>
                <option value="Body">Body</option>
                <option value="Skin">Skin Care</option>
                <option value="Hair">Hair</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₱) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (mins) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
              >
                {service ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// Promo Modal Component
// Promo Modal Component
const PromoModal = ({ promo, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: promo?.name || '',
    description: promo?.description || '',
    type: promo?.type || 'discount',
    discountType: promo?.discount_type || 'fixed',
    discountValue: promo?.discount_value || 0,
    validFrom: promo?.valid_from || '',
    validTo: promo?.valid_to || '',
    status: promo?.status || 'active',
    services: promo?.services?.map(s => s.service_id) || []
  });

  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term
    const filtered = allServices.filter(service =>
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [allServices, serviceSearchTerm]);

  const fetchAllServices = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/promos.php?action=getServices`, {
        headers: {
          'Authorization': token
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAllServices(data.data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const selectAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: allServices.map(service => service.service_id)
    }));
  };

  const clearAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in"
        style={{ animation: 'popIn 0.4s ease-out forwards' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {promo ? 'Edit Promo' : 'Add New Promo'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:rotate-90 hover:scale-110"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                  required
                >
                  <option value="discount">Discount</option>
                  <option value="special">Special Offer</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => handleChange('discountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                  required
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => handleChange('discountValue', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => handleChange('validFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid To
                </label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => handleChange('validTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                />
              </div>
            </div>

            {/* Applicable Services with Search */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Applicable Services
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllServices}
                    className="text-xs text-lime-600 hover:text-lime-800 font-medium"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllServices}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 text-sm transition-all duration-300"
                />
              </div>

              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
                {filteredServices.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm">No services found</p>
                ) : (
                  filteredServices.map((service) => (
                    <label key={service.service_id} className="flex items-center space-x-2 p-2 hover:bg-white rounded transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.service_id)}
                        onChange={() => toggleService(service.service_id)}
                        className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 block truncate">
                          {service.name}
                        </span>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{service.category}</span>
                          <span>₱{service.price} • {service.duration} mins</span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {formData.services.length} of {allServices.length} services selected
                </p>
                {serviceSearchTerm && (
                  <p className="text-xs text-gray-500">
                    Showing {filteredServices.length} services
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500 transition-all duration-300"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  promo ? 'Update Promo' : 'Add Promo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Bundle Modal Component
const BundleModal = ({ bundle, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: bundle?.name || '',
    description: bundle?.description || '',
    price: bundle?.price || 0,
    validFrom: bundle?.valid_from || '',
    validTo: bundle?.valid_to || '',
    status: bundle?.status || 'active',
    services: bundle?.services?.map(s => s.service_id) || []
  });

  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term
    const filtered = allServices.filter(service =>
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [allServices, serviceSearchTerm]);

  const fetchAllServices = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/bundles.php?action=getServices`, {
        headers: {
          'Authorization': token
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAllServices(data.data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const selectAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: allServices.map(service => service.service_id)
    }));
  };

  const clearAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in"
        style={{ animation: 'popIn 0.4s ease-out forwards' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {bundle ? 'Edit Bundle' : 'Add New Bundle'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:rotate-90 hover:scale-110"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Price (₱) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => handleChange('validFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid To
                </label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => handleChange('validTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
                />
              </div>
            </div>

            {/* Included Services with Search */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Included Services *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllServices}
                    className="text-xs text-lime-600 hover:text-lime-800 font-medium"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllServices}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 text-sm transition-all duration-300"
                />
              </div>

              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
                {filteredServices.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm">No services found</p>
                ) : (
                  filteredServices.map((service) => (
                    <label key={service.service_id} className="flex items-center space-x-2 p-2 hover:bg-white rounded transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.service_id)}
                        onChange={() => toggleService(service.service_id)}
                        className="rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 block truncate">
                          {service.name}
                        </span>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{service.category}</span>
                          <span>₱{service.price} • {service.duration} mins</span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {formData.services.length} of {allServices.length} services selected
                </p>
                {serviceSearchTerm && (
                  <p className="text-xs text-gray-500">
                    Showing {filteredServices.length} services
                  </p>
                )}
              </div>
              {formData.services.length === 0 && (
                <p className="text-xs text-red-500 mt-1">At least one service must be selected</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
                  className="rounded border-gray-300 text-lime-600 focus:ring-lime-500 transition-all duration-300"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || formData.services.length === 0}
                className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  bundle ? 'Update Bundle' : 'Add Bundle'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// Promo Detail Modal Component
const PromoDetailModal = ({ promo, onClose }) => {
  const calculateSavings = (service) => {
    if (promo.discount_type === 'percentage') {
      const discountAmount = (service.price * promo.discount_value) / 100;
      return {
        original: service.price,
        discounted: service.price - discountAmount,
        savings: discountAmount
      };
    } else {
      return {
        original: service.price,
        discounted: Math.max(0, service.price - promo.discount_value),
        savings: promo.discount_value
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in"
        style={{ animation: 'popIn 0.4s ease-out forwards' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Promo Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:rotate-90 hover:scale-110"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 font-medium">{promo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900 capitalize">{promo.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promo.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {promo.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <p className="text-orange-600 font-semibold">
                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₱${promo.discount_value}`}
                  </p>
                </div>
              </div>
              {promo.description && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600">{promo.description}</p>
                </div>
              )}
            </div>

            {/* Validity Period */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Validity Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valid From</label>
                  <p className="text-gray-900">
                    {promo.valid_from ? new Date(promo.valid_from).toLocaleDateString() : 'Immediately'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valid To</label>
                  <p className="text-gray-900">
                    {promo.valid_to ? new Date(promo.valid_to).toLocaleDateString() : 'No expiry'}
                  </p>
                </div>
              </div>
            </div>

            {/* Applicable Services */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Applicable Services ({promo.services?.length || 0})
              </h4>
              {promo.services && promo.services.length > 0 ? (
                <div className="space-y-3">
                  {promo.services.map((service) => {
                    const savings = calculateSavings(service);
                    return (
                      <div key={service.service_id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{service.name}</h5>
                            <p className="text-sm text-gray-600">{service.category} • {service.duration} mins</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">₱{savings.original}</span>
                              <span className="text-lg font-semibold text-green-600">₱{savings.discounted}</span>
                            </div>
                            <p className="text-xs text-orange-600 font-medium">
                              Save ₱{savings.savings}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No services associated with this promo</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bundle Detail Modal Component
const BundleDetailModal = ({ bundle, onClose }) => {
  const calculateTotalOriginalPrice = () => {
    return bundle.services?.reduce((total, service) => total + service.price, 0) || 0;
  };

  const calculateSavings = () => {
    const totalOriginal = calculateTotalOriginalPrice();
    return totalOriginal - bundle.price;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in"
        style={{ animation: 'popIn 0.4s ease-out forwards' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Bundle Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:rotate-90 hover:scale-110"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 font-medium">{bundle.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bundle.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bundle.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bundle Price</label>
                  <p className="text-lime-600 font-semibold text-xl">₱{bundle.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Services</label>
                  <p className="text-gray-900 font-medium">{bundle.services?.length || 0} services</p>
                </div>
              </div>
              {bundle.description && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600">{bundle.description}</p>
                </div>
              )}
            </div>

            {/* Validity Period */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Validity Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valid From</label>
                  <p className="text-gray-900">
                    {bundle.valid_from ? new Date(bundle.valid_from).toLocaleDateString() : 'Immediately'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valid To</label>
                  <p className="text-gray-900">
                    {bundle.valid_to ? new Date(bundle.valid_to).toLocaleDateString() : 'No expiry'}
                  </p>
                </div>
              </div>
            </div>

            {/* Included Services */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Included Services ({bundle.services?.length || 0})
              </h4>
              {bundle.services && bundle.services.length > 0 ? (
                <div className="space-y-3">
                  {bundle.services.map((service) => (
                    <div key={service.service_id} className="border border-gray-200 rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{service.name}</h5>
                          <p className="text-sm text-gray-600">{service.category} • {service.duration} mins</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 line-through text-sm">₱{service.price}</span>
                          <p className="text-xs text-green-600">Included in bundle</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No services included in this bundle</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function AdminDashboard() {
  const [user, setUser] = useState({
  name: "Admin User",
  role: "Administrator",
  lastLogin: new Date().toLocaleDateString()
});
  const [content, setContent] = useState({
    hero: {
      title: "Radiant Skin Starts Here",
      subtitle: "Experience professional skin care treatments tailored to your unique needs. Our expert dermatologists help you achieve healthy, glowing skin."
    },
    services: [
      {
        title: "Facial Treatments",
        description: "Customized facials for deep cleansing, hydration, and rejuvenation.",
        features: ["Hydrating Facials", "Anti-Aging Treatments", "Acne Solutions", "Brightening Therapy"]
      },
      {
        title: "Laser Therapy",
        description: "Advanced laser treatments for skin resurfacing and pigmentation.",
        features: ["Laser Hair Removal", "Skin Resurfacing", "Pigment Correction", "Scar Treatment"]
      },
      {
        title: "Skin Consultation",
        description: "Personalized skin analysis and treatment plans by expert dermatologists.",
        features: ["Skin Analysis", "Custom Treatment Plans", "Product Recommendations", "Follow-up Care"]
      }
    ],
    about: {
  title: "Why Choose Lizly Skin Care?",
  points: [
    {
      title: "Expert Dermatologists",
      description: "Our team consists of certified dermatologists with years of experience."
    },
    {
      title: "Advanced Technology", 
      description: "We use the latest medical-grade equipment for optimal results."
    },
    {
      title: "Personalized Care", 
        description: "Every treatment plan is customized to your specific skin needs."
      },
          {
      title: "Natural Results", 
        description: "We focus on enhancing your natural beauty with subtle, effective treatments."
      },
  ]},
  });

  const [images, setImages] = useState({
    heroImage: null,
    aboutImage: null,
    service1Image: null,
    service2Image: null,
    service3Image: null
  });

  const [promos, setPromos] = useState([]);
const [bundles, setBundles] = useState([]);
const [editingPromo, setEditingPromo] = useState(null);
const [editingBundle, setEditingBundle] = useState(null);
const [showPromoModal, setShowPromoModal] = useState(false);
const [showBundleModal, setShowBundleModal] = useState(false);const [currentPromoPage, setCurrentPromoPage] = useState(1);
const [currentBundlePage, setCurrentBundlePage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [promoSearchTerm, setPromoSearchTerm] = useState("");
const [bundleSearchTerm, setBundleSearchTerm] = useState("");
const [promoStatusFilter, setPromoStatusFilter] = useState("All");
const [bundleStatusFilter, setBundleStatusFilter] = useState("All");
const [isPromoAnimating, setIsPromoAnimating] = useState(false);
const [isBundleAnimating, setIsBundleAnimating] = useState(false);
const [selectedPromo, setSelectedPromo] = useState(null);
const [selectedBundle, setSelectedBundle] = useState(null);
const [showPromoDetailModal, setShowPromoDetailModal] = useState(false);
const [showBundleDetailModal, setShowBundleDetailModal] = useState(false);

  const [activeTab, setActiveTab] = useState("content");
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [services, setServices] = useState([]);
const [editingService, setEditingService] = useState(null);
const [showServiceModal, setShowServiceModal] = useState(false);
const [servicesPerPage, setServicesPerPage] = useState(10);
const [serviceSearchTerm, setServiceSearchTerm] = useState("");
const [serviceCategoryFilter, setServiceCategoryFilter] = useState("All");
const [serviceStatusFilter, setServiceStatusFilter] = useState("All");
const [isServiceAnimating, setIsServiceAnimating] = useState(false);


  // Check authentication and load data on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const [memberships, setMemberships] = useState({
  basic: {
    name: "Basic",
    price: 3000,
    consumable: 6000,
    features: ["Essential treatments", "Basic facial services", "Standard consultations"]
  },
  pro: {
    name: "Pro",
    price: 6000, 
    consumable: 10000,
    features: ["All Basic features", "Advanced treatments", "Laser therapies", "Priority scheduling"]
  },
  promo: {
    name: "Promo",
    price: "Special",
    consumable: "Custom",
    features: ["Seasonal offers", "Limited time deals", "Bundle packages", "Exclusive treatments"]
  }
});

// Add this function to handle membership changes
const handleMembershipChange = (tier, field, value, featureIndex = null) => {
  setMemberships(prev => {
    if (featureIndex !== null) {
      // Update specific feature
      const updatedFeatures = [...prev[tier].features];
      updatedFeatures[featureIndex] = value;
      return {
        ...prev,
        [tier]: {
          ...prev[tier],
          features: updatedFeatures
        }
      };
    } else if (field === 'features') {
      // Handle features as array from textarea
      const features = value.split('\n').filter(feature => feature.trim() !== '');
      return {
        ...prev,
        [tier]: {
          ...prev[tier],
          features: features
        }
      };
    } else {
      // Update other fields
      return {
        ...prev,
        [tier]: {
          ...prev[tier],
          [field]: field === 'price' || field === 'consumable' ? 
                   (value === '' ? '' : (tier === 'promo' ? value : Number(value))) : 
                   value
        }
      };
    }
  });
};

// Add this function to save memberships to database
const saveMemberships = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/content.php?action=updateSection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        section: "memberships",
        content: memberships
      })
    });

    const data = await response.json();
    if (data.success) {
      showMessage('Memberships updated successfully!');
    } else {
      showMessage(data.error || "Failed to save memberships", 'error');
    }
  } catch (error) {
    showMessage("Save error: " + error.message, 'error');
  }
};

// Add this function to load memberships from database
const loadMemberships = async () => {
  try {
    const response = await fetch(`${API_BASE}/content.php?action=getSection&section=memberships`);
    const data = await response.json();
    
    if (data.success && data.data.content) {
      setMemberships(data.data.content);
    }
  } catch (error) {
    console.error("Failed to load memberships:", error);
  }
};

// Promos Management
const fetchPromos = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/promos.php?action=getAll`, {
      headers: {
        'Authorization': token
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setPromos(data.data.promos || []);
    } else {
      showMessage(data.error || "Failed to fetch promos", 'error');
    }
  } catch (error) {
    showMessage("Error fetching promos: " + error.message, 'error');
  }
};

const savePromo = async (promoData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const url = editingPromo 
      ? `${API_BASE}/promos.php?action=updatePromo`
      : `${API_BASE}/promos.php?action=addPromo`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(editingPromo ? { ...promoData, promo_id: editingPromo.promo_id } : promoData)
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage(editingPromo ? 'Promo updated successfully!' : 'Promo added successfully!');
      setShowPromoModal(false);
      setEditingPromo(null);
      fetchPromos();
    } else {
      showMessage(data.error || "Failed to save promo", 'error');
    }
  } catch (error) {
    showMessage("Error saving promo: " + error.message, 'error');
  }
};

const deletePromo = async (promoId) => {
  if (!confirm("Are you sure you want to delete this promo? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/promos.php?action=deletePromo`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ promo_id: promoId })
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage('Promo deleted successfully!');
      fetchPromos();
    } else {
      showMessage(data.error || "Failed to delete promo", 'error');
    }
  } catch (error) {
    showMessage("Error deleting promo: " + error.message, 'error');
  }
};

// Bundles Management
const fetchBundles = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/bundles2.php?action=getAll`, {
      headers: {
        'Authorization': token
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setBundles(data.data.bundles || []);
    } else {
      showMessage(data.error || "Failed to fetch bundles", 'error');
    }
  } catch (error) {
    showMessage("Error fetching bundles: " + error.message, 'error');
  }
};

const saveBundle = async (bundleData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const url = editingBundle 
      ? `${API_BASE}/bundles.php?action=updateBundle`
      : `${API_BASE}/bundles.php?action=addBundle`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(editingBundle ? { ...bundleData, bundle_id: editingBundle.bundle_id } : bundleData)
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage(editingBundle ? 'Bundle updated successfully!' : 'Bundle added successfully!');
      setShowBundleModal(false);
      setEditingBundle(null);
      fetchBundles();
    } else {
      showMessage(data.error || "Failed to save bundle", 'error');
    }
  } catch (error) {
    showMessage("Error saving bundle: " + error.message, 'error');
  }
};

const deleteBundle = async (bundleId) => {
  if (!confirm("Are you sure you want to delete this bundle? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/bundles.php?action=deleteBundle`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ bundle_id: bundleId })
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage('Bundle deleted successfully!');
      fetchBundles();
    } else {
      showMessage(data.error || "Failed to delete bundle", 'error');
    }
  } catch (error) {
    showMessage("Error deleting bundle: " + error.message, 'error');
  }
};

const fetchServices = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/services.php?action=getAllForAdmin`, {
      headers: {
        'Authorization': token
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setServices(data.data.services || []);
    } else {
      showMessage(data.error || "Failed to fetch services", 'error');
    }
  } catch (error) {
    showMessage("Error fetching services: " + error.message, 'error');
  }
};

const toggleServiceStatus = async (serviceId, isActive) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/services.php?action=toggleStatus&id=${serviceId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ is_active: isActive })
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage('Service status updated successfully!');
      fetchServices(); // Refresh the list
    } else {
      showMessage(data.error || "Failed to update service status", 'error');
    }
  } catch (error) {
    showMessage("Error updating service status: " + error.message, 'error');
  }
};

const deleteService = async (serviceId) => {
  if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE}/services.php?action=deleteService&id=${serviceId}`, {
      method: "POST",
      headers: {
        'Authorization': token
      }
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage('Service deleted successfully!');
      fetchServices(); // Refresh the list
    } else {
      showMessage(data.error || "Failed to delete service", 'error');
    }
  } catch (error) {
    showMessage("Error deleting service: " + error.message, 'error');
  }
};

const saveService = async (serviceData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const url = editingService 
      ? `${API_BASE}/services.php?action=updateService&id=${editingService.service_id}`
      : `${API_BASE}/services.php?action=addService`;
    
    const method = "POST";
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(serviceData)
    });
    
    const data = await response.json();
    if (data.success) {
      showMessage(editingService ? 'Service updated successfully!' : 'Service added successfully!');
      setShowServiceModal(false);
      setEditingService(null);
      fetchServices(); // Refresh the list
    } else {
      showMessage(data.error || "Failed to save service", 'error');
    }
  } catch (error) {
    showMessage("Error saving service: " + error.message, 'error');
  }
};

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

// Update the checkAuth function
const checkAuth = async () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    try {
      const response = await fetch(`${API_BASE}/auth.php?action=verify`, {
        method: 'POST',
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        await loadContent();
        await loadImages();
        await fetchServices();
        await fetchPromos();
        await fetchBundles();
        await loadMemberships(); // Add this line
      } else {
        localStorage.removeItem("adminToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("adminToken");
    }
  }
};

  const loadContent = async () => {
    try {
      const response = await fetch(`${API_BASE}/content.php?action=getAll`);
      const data = await response.json();
      
      if (data.success && data.data.content) {
        setContent(data.data.content);
      } else {
        showMessage('Failed to load content: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showMessage('Failed to load content: ' + error.message, 'error');
    }
  };

 const loadImages = async () => {
  try {
    const imagesResponse = await fetch(`${API_BASE}/api/images.php?action=getAll`);
    const imagesData = await imagesResponse.json();
    
    if (imagesData.success && imagesData.data && imagesData.data.images) {
      const loadedImages = {};
      Object.entries(imagesData.data.images).forEach(([key, imageInfo]) => {
        if (imageInfo && imageInfo.url) {
          // Use the correct URL format
          loadedImages[key] = `${API_BASE}/api/images.php?action=getImage&key=${key}`;
        }
      });
      setImages(loadedImages);
    }
  } catch (error) {
    console.error("Failed to load images:", error);
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("adminToken", data.data.token);
        setIsLoggedIn(true);
        await loadContent();
        await loadImages();
        showMessage('Login successful!');
      } else {
        showMessage(data.error || "Login failed", 'error');
      }
    } catch (error) {
      showMessage("Login error: " + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
    showMessage('Logged out successfully');
  };

  const handleContentChange = (section, field, value, index = null) => {
    setContent(prev => {
      if (index !== null) {
        const updatedArray = [...prev[section]];
        updatedArray[index] = {
          ...updatedArray[index],
          [field]: value
        };
        return { ...prev, [section]: updatedArray };
      } else if (typeof prev[section] === 'object' && !Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {  
        return { ...prev, [section]: value };
      }
    });
  };

  const handleImageUpload = async (imageKey, file) => {
  console.log('Uploading image:', imageKey, file);
  
  const formData = new FormData();
  formData.append("key", imageKey);
  formData.append("image", file);

  try {
    const token = localStorage.getItem("adminToken");
    
    const response = await fetch(`${API_BASE}/api/images.php?action=uploadImage`, {
  method: "POST",
  headers: { 
    'Authorization': token
  },
  body: formData
});

    const data = await response.json();
    console.log('Upload response:', data);
    
    if (data.success) {
      // Use the URL provided by the backend
      const imageUrl = data.data.url || `${API_BASE}/images.php?action=getImage&key=${imageKey}`;
      
      setImages(prev => ({
        ...prev,
        [imageKey]: imageUrl
      }));
      showMessage('Image uploaded successfully!');
      
      // Force reload images for the frontend
      await loadImages();
    } else {
      showMessage(data.error || "Upload failed", 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showMessage("Upload error: " + error.message, 'error');
  }
};

  const saveChanges = async () => {
    const token = localStorage.getItem("adminToken");
    
    try {
      const response = await fetch(`${API_BASE}/content.php?action=updateAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        showMessage('Changes saved successfully!');
        setTimeout(() => setSaved(false), 3000);
      } else {
        showMessage(data.error || "Save failed", 'error');
      }
    } catch (error) {
      showMessage("Save error: " + error.message, 'error');
    }
  };

  const resetContent = async () => {
    if (!confirm("Are you sure you want to reset all content to default? This cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    
    try {
      const response = await fetch(`${API_BASE}/content.php?action=reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      const data = await response.json();
      if (data.success) {
        await loadContent();
        showMessage('Content reset to default successfully!');
      } else {
        showMessage(data.error || "Reset failed", 'error');
      }
    } catch (error) {
      showMessage("Reset error: " + error.message, 'error');
    }
  };

  const previewSite = () => {
    window.open("/", "_blank");
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Lizly Admin</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your landing page</p>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg mb-6 ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-700"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-700"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-colors disabled:opacity-50"
            >
              <LogIn size={20} />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
<div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-r from-lime-500 to-green-500 p-3 rounded-2xl">
        <Shield className="text-white" size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lizly Skin Care Admin</h1>
        <p className="text-gray-600 flex items-center gap-2 mt-1">
          <span>Welcome back,</span>
          <span className="font-semibold text-lime-600">{user?.name || 'Admin'}</span>
          <span>•</span>
          <span className="text-sm bg-lime-100 text-lime-800 px-2 py-1 rounded-full">
            {user?.role || 'Administrator'}
          </span>
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-3">

        <button
          onClick={previewSite}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        >
          <Eye size={18} />
          Preview Site
        </button>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={saveChanges}
          className="flex items-center gap-2 bg-gradient-to-r from-lime-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-lime-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-medium"
        >
          <Save size={18} />
          Save Changes
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  </div>
  
  {message.text && (
    <div className={`mt-4 p-4 rounded-xl border-l-4 ${
      message.type === 'error' 
        ? 'bg-red-50 border-red-400 text-red-700' 
        : 'bg-green-50 border-green-400 text-green-700'
    }`}>
      <div className="flex items-center gap-2">
        {message.type === 'error' ? (
          <X className="text-red-500" size={20} />
        ) : (
          <CheckCircle className="text-green-500" size={20} />
        )}
        <span className="font-medium">{message.text}</span>
      </div>
    </div>
  )}
  
  {saved && (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
      <div className="flex items-center gap-2 text-green-700">
        <CheckCircle size={20} />
        <span className="font-medium">Changes saved successfully!</span>
      </div>
    </div>
  )}
</div>


{/* Stats Overview */}
{activeTab === "content" && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    {[
      {
        title: "Total Services",
        value: services.length,
        icon: <Package className="text-blue-500" size={24} />,
        color: "bg-blue-50 border-blue-200",
        change: "+12%",
        trend: "up"
      },
      {
        title: "Active Promos",
        value: promos.filter(p => p.status === 'active').length,
        icon: <Tag className="text-orange-500" size={24} />,
        color: "bg-orange-50 border-orange-200",
        change: "+5%",
        trend: "up"
      },
      {
        title: "Service Bundles",
        value: bundles.length,
        icon: <Package className="text-purple-500" size={24} />,
        color: "bg-purple-50 border-purple-200",
        change: "+8%",
        trend: "up"
      },
      {
        title: "Total Revenue",
        value: "₱45.2K",
        icon: <DollarSign className="text-green-500" size={24} />,
        color: "bg-green-50 border-green-200",
        change: "+23%",
        trend: "up"
      }
    ].map((stat, index) => (
      <div 
        key={stat.title}
        className={`bg-white rounded-2xl p-6 border-2 ${stat.color} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.color.replace('bg-', 'bg-').replace(' border-', ' ')}`}>
            {stat.icon}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp size={14} />
            <span>{stat.change}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
      </div>
    ))}
  </div>
)}

        {/* Enhanced Navigation Tabs */}
<div className="bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
  <div className="flex overflow-x-auto scrollbar-hide">
    <nav className="flex -mb-px min-w-full">
      {[
        { id: "content", label: "Content", icon: <Edit size={18} /> },
        { id: "images", label: "Images", icon: <Image size={18} /> },
        { id: "memberships", label: "Memberships", icon: <Package size={18} /> },
        { id: "services", label: "Services", icon: <Package size={18} /> },
        { id: "promos", label: "Promos", icon: <Tag size={18} /> },
        { id: "bundles", label: "Bundles", icon: <Package size={18} /> },
        { id: "settings", label: "Settings", icon: <Settings size={18} /> },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            activeTab === tab.id
              ? "border-lime-500 text-lime-600 bg-lime-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
</div>


{/* Services Management Tab */}
{activeTab === "services" && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Services Management</h2>
      <button
        onClick={() => {
          setEditingService(null);
          setShowServiceModal(true);
        }}
        className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Add New Service
      </button>
    </div>

    {/* Search and Filter Controls */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Search */}
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={serviceCategoryFilter}
            onChange={(e) => setServiceCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-800 transition-all duration-300"
          >
            <option value="All">All Categories</option>
            {[...new Set(services.map(service => service.category))].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={serviceStatusFilter}
          onChange={(e) => setServiceStatusFilter(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-800 transition-all duration-300"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    {/* Filtered Services */}
    {(() => {
      // Filter services based on search, category, and status
      const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                            service.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase());
        const matchesCategory = serviceCategoryFilter === "All" || service.category === serviceCategoryFilter;
        const matchesStatus = serviceStatusFilter === "All" || 
                            (serviceStatusFilter === "Active" && service.is_active) ||
                            (serviceStatusFilter === "Inactive" && !service.is_active);
        
        return matchesSearch && matchesCategory && matchesStatus;
      });

      // Pagination calculations
      const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
      const startIndex = (currentServicePage - 1) * servicesPerPage;
      const endIndex = startIndex + servicesPerPage;
      const currentServices = filteredServices.slice(startIndex, endIndex);

      // Animated page change
      const changePage = (newPage) => {
        if (newPage === currentServicePage || isServiceAnimating) return;
        
        setIsServiceAnimating(true);
        setTimeout(() => {
          setCurrentServicePage(newPage);
          setIsServiceAnimating(false);
        }, 300);
      };

      // Generate page numbers
      const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentServicePage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        return pages;
      };

      return (
        <>
          {/* Services Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
            </p>
            
            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={servicesPerPage}
                onChange={(e) => {
                  setServicesPerPage(Number(e.target.value));
                  setCurrentServicePage(1);
                }}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-lime-500 text-gray-800 transition-all duration-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {services.length === 0 ? 
                        "No services found. Add your first service to get started." : 
                        "No services match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  currentServices.map((service, index) => (
                    <tr 
                      key={service.service_id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
                        isServiceAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        animationDelay: isServiceAnimating ? '0ms' : `${index * 50}ms`,
                        animation: isServiceAnimating ? 'none' : 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{service.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full text-xs">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-semibold">₱{service.price}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{service.duration} mins</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleServiceStatus(service.service_id, !service.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                            service.is_active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setShowServiceModal(true);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                            title="Edit Service"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {currentServicePage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => changePage(Math.max(currentServicePage - 1, 1))}
                  disabled={currentServicePage === 1 || isServiceAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentServicePage === 1 || isServiceAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    disabled={isServiceAnimating}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform ${
                      currentServicePage === page
                        ? 'bg-lime-600 border-lime-600 text-white scale-105 shadow-lg'
                        : `border-gray-300 text-gray-600 hover:bg-lime-50 hover:scale-110 active:scale-95 ${
                            isServiceAnimating ? 'opacity-50' : 'opacity-100'
                          }`
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => changePage(Math.min(currentServicePage + 1, totalPages))}
                  disabled={currentServicePage === totalPages || isServiceAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentServicePage === totalPages || isServiceAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Page Selector */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Go to page:</span>
                <select
                  value={currentServicePage}
                  onChange={(e) => changePage(Number(e.target.value))}
                  disabled={isServiceAnimating}
                  className={`border border-gray-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-lime-500 transition-all duration-300 ${
                    isServiceAnimating ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      );
    })()}

    {/* Service Modal */}
    {showServiceModal && (
      <ServiceModal
        service={editingService}
        onSave={saveService}
        onClose={() => {
          setShowServiceModal(false);
          setEditingService(null);
        }}
      />
    )}
  </div>
)}


{/* Memberships Management Tab */}
{activeTab === "memberships" && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Package size={24} />
        Memberships Management
      </h2>
      <button
        onClick={saveMemberships}
        className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Save size={20} />
        Save Memberships
      </button>
    </div>

    <div className="grid gap-8">
      {/* Basic Membership */}
      <div className="border-2 border-lime-200 rounded-xl p-6 bg-lime-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-8 bg-lime-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">Basic Membership</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Name
            </label>
            <input
              type="text"
              value={memberships.basic.name}
              onChange={(e) => handleMembershipChange('basic', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₱)
              </label>
              <input
                type="number"
                value={memberships.basic.price}
                onChange={(e) => handleMembershipChange('basic', 'price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumable (₱)
              </label>
              <input
                type="number"
                value={memberships.basic.consumable}
                onChange={(e) => handleMembershipChange('basic', 'consumable', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (one per line)
          </label>
          <textarea
            value={memberships.basic.features.join('\n')}
            onChange={(e) => handleMembershipChange('basic', 'features', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            placeholder="Enter each feature on a new line"
          />
          <p className="text-xs text-gray-500 mt-1">
            {memberships.basic.features.length} features
          </p>
        </div>
      </div>

      {/* Pro Membership */}
      <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-8 bg-green-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">Pro Membership</h3>
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            MOST POPULAR
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Name
            </label>
            <input
              type="text"
              value={memberships.pro.name}
              onChange={(e) => handleMembershipChange('pro', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₱)
              </label>
              <input
                type="number"
                value={memberships.pro.price}
                onChange={(e) => handleMembershipChange('pro', 'price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumable (₱)
              </label>
              <input
                type="number"
                value={memberships.pro.consumable}
                onChange={(e) => handleMembershipChange('pro', 'consumable', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (one per line)
          </label>
          <textarea
            value={memberships.pro.features.join('\n')}
            onChange={(e) => handleMembershipChange('pro', 'features', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            placeholder="Enter each feature on a new line"
          />
          <p className="text-xs text-gray-500 mt-1">
            {memberships.pro.features.length} features
          </p>
        </div>
      </div>

      {/* Promo Membership */}
      <div className="border-2 border-yellow-200 rounded-xl p-6 bg-yellow-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-8 bg-yellow-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">Promo Membership</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Name
            </label>
            <input
              type="text"
              value={memberships.promo.name}
              onChange={(e) => handleMembershipChange('promo', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Display
              </label>
              <input
                type="text"
                value={memberships.promo.price}
                onChange={(e) => handleMembershipChange('promo', 'price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                placeholder="e.g., Special, Custom, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumable Display
              </label>
              <input
                type="text"
                value={memberships.promo.consumable}
                onChange={(e) => handleMembershipChange('promo', 'consumable', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                placeholder="e.g., Custom, Varies, etc."
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (one per line)
          </label>
          <textarea
            value={memberships.promo.features.join('\n')}
            onChange={(e) => handleMembershipChange('promo', 'features', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            placeholder="Enter each feature on a new line"
          />
          <p className="text-xs text-gray-500 mt-1">
            {memberships.promo.features.length} features
          </p>
        </div>
      </div>
    </div>

    {/* Summary Card */}
    <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Memberships Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-lg border border-lime-200">
          <div className="text-2xl font-bold text-lime-600">₱{memberships.basic.price}</div>
          <div className="text-sm text-gray-600">Basic Membership</div>
          <div className="text-xs text-gray-500 mt-1">₱{memberships.basic.consumable} consumable</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">₱{memberships.pro.price}</div>
          <div className="text-sm text-gray-600">Pro Membership</div>
          <div className="text-xs text-gray-500 mt-1">₱{memberships.pro.consumable} consumable</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{memberships.promo.price}</div>
          <div className="text-sm text-gray-600">Promo Membership</div>
          <div className="text-xs text-gray-500 mt-1">{memberships.promo.consumable} pricing</div>
        </div>
      </div>
    </div>
  </div>
)}


{/* Promos Management Tab */}
{activeTab === "promos" && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Tag size={24} />
        Promos Management
      </h2>
      <button
        onClick={() => {
          setEditingPromo(null);
          setShowPromoModal(true);
        }}
        className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Add New Promo
      </button>
    </div>

    {/* Search and Filter Controls */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Search */}
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search promos..."
            value={promoSearchTerm}
            onChange={(e) => setPromoSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={promoStatusFilter}
          onChange={(e) => setPromoStatusFilter(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-800 transition-all duration-300"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    {/* Filtered Promos */}
    {(() => {
      const filteredPromos = promos.filter(promo => {
        const matchesSearch = promo.name.toLowerCase().includes(promoSearchTerm.toLowerCase()) ||
                            promo.description?.toLowerCase().includes(promoSearchTerm.toLowerCase());
        const matchesStatus = promoStatusFilter === "All" || promo.status === promoStatusFilter;
        
        return matchesSearch && matchesStatus;
      });

      const totalPages = Math.ceil(filteredPromos.length / itemsPerPage);
      const startIndex = (currentPromoPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPromos = filteredPromos.slice(startIndex, endIndex);

      const changePage = (newPage) => {
        if (newPage === currentPromoPage || isPromoAnimating) return;
        
        setIsPromoAnimating(true);
        setTimeout(() => {
          setCurrentPromoPage(newPage);
          setIsPromoAnimating(false);
        }, 300);
      };

      const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPromoPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        return pages;
      };

      return (
        <>
          {/* Promos Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPromos.length)} of {filteredPromos.length} promos
            </p>
          </div>

          {/* Promos Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Discount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Valid Until</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPromos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {promos.length === 0 ? 
                        "No promos found. Add your first promo to get started." : 
                        "No promos match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  currentPromos.map((promo, index) => (
                    <tr 
                      key={promo.promo_id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
                        isPromoAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        animationDelay: isPromoAnimating ? '0ms' : `${index * 50}ms`,
                        animation: isPromoAnimating ? 'none' : 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{promo.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{promo.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">{promo.type}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₱${promo.discount_value}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {promo.valid_to ? new Date(promo.valid_to).toLocaleDateString() : 'No expiry'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          promo.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPromo(promo);
                              setShowPromoDetailModal(true);
                            }}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPromo(promo);
                              setShowPromoModal(true);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                            title="Edit Promo"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {currentPromoPage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(Math.max(currentPromoPage - 1, 1))}
                  disabled={currentPromoPage === 1 || isPromoAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentPromoPage === 1 || isPromoAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    disabled={isPromoAnimating}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform ${
                      currentPromoPage === page
                        ? 'bg-lime-600 border-lime-600 text-white scale-105 shadow-lg'
                        : `border-gray-300 text-gray-600 hover:bg-lime-50 hover:scale-110 active:scale-95 ${
                            isPromoAnimating ? 'opacity-50' : 'opacity-100'
                          }`
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => changePage(Math.min(currentPromoPage + 1, totalPages))}
                  disabled={currentPromoPage === totalPages || isPromoAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentPromoPage === totalPages || isPromoAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      );
    })()}

    {/* Promo Modal */}
    {showPromoModal && (
      <PromoModal
        promo={editingPromo}
        onSave={savePromo}
        onClose={() => {
          setShowPromoModal(false);
          setEditingPromo(null);
        }}
      />
    )}

    {/* Promo Detail Modal */}
    {showPromoDetailModal && selectedPromo && (
      <PromoDetailModal
        promo={selectedPromo}
        onClose={() => {
          setShowPromoDetailModal(false);
          setSelectedPromo(null);
        }}
      />
    )}
  </div>
)}


{/* Bundles Management Tab */}
{activeTab === "bundles" && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Package size={24} />
        Bundles Management
      </h2>
      <button
        onClick={() => {
          setEditingBundle(null);
          setShowBundleModal(true);
        }}
        className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Add New Bundle
      </button>
    </div>

    {/* Search and Filter Controls */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Search */}
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search bundles..."
            value={bundleSearchTerm}
            onChange={(e) => setBundleSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 transition-all duration-300"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={bundleStatusFilter}
          onChange={(e) => setBundleStatusFilter(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-800 transition-all duration-300"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    {/* Filtered Bundles */}
    {(() => {
      const filteredBundles = bundles.filter(bundle => {
        const matchesSearch = bundle.name.toLowerCase().includes(bundleSearchTerm.toLowerCase()) ||
                            bundle.description?.toLowerCase().includes(bundleSearchTerm.toLowerCase());
        const matchesStatus = bundleStatusFilter === "All" || bundle.status === bundleStatusFilter;
        
        return matchesSearch && matchesStatus;
      });

      const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);
      const startIndex = (currentBundlePage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentBundles = filteredBundles.slice(startIndex, endIndex);

      const changePage = (newPage) => {
        if (newPage === currentBundlePage || isBundleAnimating) return;
        
        setIsBundleAnimating(true);
        setTimeout(() => {
          setCurrentBundlePage(newPage);
          setIsBundleAnimating(false);
        }, 300);
      };

      const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentBundlePage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        return pages;
      };

      return (
        <>
          {/* Bundles Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredBundles.length)} of {filteredBundles.length} bundles
            </p>
          </div>

          {/* Bundles Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Services</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Valid Until</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBundles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {bundles.length === 0 ? 
                        "No bundles found. Add your first bundle to get started." : 
                        "No bundles match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  currentBundles.map((bundle, index) => (
                    <tr 
                      key={bundle.bundle_id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
                        isBundleAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        animationDelay: isBundleAnimating ? '0ms' : `${index * 50}ms`,
                        animation: isBundleAnimating ? 'none' : 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{bundle.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{bundle.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-lime-600">₱{bundle.price}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {bundle.services?.length || 0} services
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {bundle.valid_to ? new Date(bundle.valid_to).toLocaleDateString() : 'No expiry'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bundle.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bundle.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBundle(bundle);
                              setShowBundleDetailModal(true);
                            }}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingBundle(bundle);
                              setShowBundleModal(true);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                            title="Edit Bundle"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {currentBundlePage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(Math.max(currentBundlePage - 1, 1))}
                  disabled={currentBundlePage === 1 || isBundleAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentBundlePage === 1 || isBundleAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    disabled={isBundleAnimating}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform ${
                      currentBundlePage === page
                        ? 'bg-lime-600 border-lime-600 text-white scale-105 shadow-lg'
                        : `border-gray-300 text-gray-600 hover:bg-lime-50 hover:scale-110 active:scale-95 ${
                            isBundleAnimating ? 'opacity-50' : 'opacity-100'
                          }`
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => changePage(Math.min(currentBundlePage + 1, totalPages))}
                  disabled={currentBundlePage === totalPages || isBundleAnimating}
                  className={`p-2 rounded-lg border transition-all duration-300 transform ${
                    currentBundlePage === totalPages || isBundleAnimating
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed scale-100'
                      : 'border-lime-300 text-lime-600 hover:bg-lime-50 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      );
    })()}

    {/* Bundle Modal */}
    {showBundleModal && (
      <BundleModal
        bundle={editingBundle}
        onSave={saveBundle}
        onClose={() => {
          setShowBundleModal(false);
          setEditingBundle(null);
        }}
      />
    )}

    {/* Bundle Detail Modal */}
    {showBundleDetailModal && selectedBundle && (
      <BundleDetailModal
        bundle={selectedBundle}
        onClose={() => {
          setShowBundleDetailModal(false);
          setSelectedBundle(null);
        }}
      />
    )}
  </div>
)}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="grid gap-6">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Hero Section</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => handleContentChange("hero", "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => handleContentChange("hero", "subtitle", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Services Section */}
<div className="bg-white rounded-lg shadow-sm p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Services</h2>
    <div className="flex gap-3 items-center">
      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {content.services?.length || 0}/10 services
      </span>
      {content.services?.length < 10 && (
        <button
          onClick={() => {
            if (content.services?.length < 10) {
              const newService = {
                title: "New Service",
                description: "Service description...",
                features: ["Feature 1", "Feature 2", "Feature 3"]
              };
              setContent(prev => ({
                ...prev,
                services: [...(prev.services || []), newService]
              }));
            }
          }}
          className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors text-sm"
        >
          Add Service
        </button>
      )}
    </div>
  </div>

  {/* Empty State */}
  {(!content.services || content.services.length === 0) && (
    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-gray-400 mb-3">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Added</h3>
      <p className="text-gray-500 mb-4">Add up to 10 services to display in the Popular Services section.</p>
      <button
        onClick={() => {
          const newService = {
            title: "New Service",
            description: "Service description...",
            features: ["Feature 1", "Feature 2", "Feature 3"]
          };
          setContent(prev => ({
            ...prev,
            services: [newService]
          }));
        }}
        className="bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition-colors"
      >
        Add Your First Service
      </button>
    </div>
  )}

  {/* Services with Pagination */}
  {content.services && content.services.length > 0 && (
    <>
      {/* Services Grid - Show 3 per page */}
      <div className="grid gap-6 mb-6">
        {content.services
          ?.slice((currentServicePage - 1) * 3, currentServicePage * 3)
          .map((service, index) => {
            const globalIndex = (currentServicePage - 1) * 3 + index;
            return (
              <div key={globalIndex} className="border-l-4 border-lime-500 pl-4 bg-lime-50 rounded-r-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Service {globalIndex + 1} 
                    {service.title && service.title !== "New Service" && (
                      <span className="text-lime-600 text-sm block mt-1">"{service.title}"</span>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      const updatedServices = content.services?.filter((_, i) => i !== globalIndex);
                      setContent(prev => ({
                        ...prev,
                        services: updatedServices
                      }));
                      // Adjust page if needed after deletion
                      if (updatedServices.length <= (currentServicePage - 1) * 3) {
                        setCurrentServicePage(Math.max(1, currentServicePage - 1));
                      }
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors text-sm bg-red-50 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleContentChange("services", "title", e.target.value, globalIndex)}
                      placeholder="e.g., Facial Treatments, Laser Therapy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description *
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleContentChange("services", "description", e.target.value, globalIndex)}
                      placeholder="Brief description of the service..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Features (one per line) *
                      </label>
                      <span className="text-xs text-gray-500">
                        {service.features?.length || 0} features
                      </span>
                    </div>
                    <textarea
                      value={service.features?.join("\n") || ''}
                      onChange={(e) => {
                        const features = e.target.value.split("\n").filter(feature => feature.trim() !== '');
                        handleContentChange("services", "features", features, globalIndex);
                      }}
                      placeholder={`Hydrating Facials\nAnti-Aging Treatments\nAcne Solutions\nBrightening Therapy`}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter each feature on a new line. At least one feature is required.
                    </p>
                  </div>

                  {/* Service Image Status */}
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Image
                        </label>
                        <p className="text-xs text-gray-500">
                          {images[`service${globalIndex + 1}Image`] 
                            ? "✓ Image uploaded" 
                            : "No image uploaded - will use placeholder"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("images")}
                        className="text-lime-600 hover:text-lime-800 text-sm font-medium"
                      >
                        {images[`service${globalIndex + 1}Image`] ? "Change Image" : "Upload Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination Controls */}
      {content.services.length > 3 && (
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentServicePage - 1) * 3) + 1} to {Math.min(currentServicePage * 3, content.services.length)} of {content.services.length} services
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentServicePage(prev => Math.max(1, prev - 1))}
              disabled={currentServicePage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(content.services.length / 3) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentServicePage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    currentServicePage === i + 1
                      ? 'bg-lime-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentServicePage(prev => Math.min(Math.ceil(content.services.length / 3), prev + 1))}
              disabled={currentServicePage >= Math.ceil(content.services.length / 3)}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )}

  {/* Maximum Services Warning */}
  {content.services?.length >= 10 && (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-yellow-700 text-sm">
          Maximum of 10 services reached. Remove a service to add new ones.
        </p>
      </div>
    </div>
  )}
</div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
              <div className="grid gap-4">
                <input
                  type="text"
                  value={content.contact?.phone || ''}
                  onChange={(e) => handleContentChange("contact", "phone", e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                />
                <input
                  type="email"
                  value={content.contact?.email || ''}
                  onChange={(e) => handleContentChange("contact", "email", e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                />
                <textarea
                  value={content.contact?.address || ''}
                  onChange={(e) => handleContentChange("contact", "address", e.target.value)}
                  placeholder="Address"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
{activeTab === "images" && (
  <div className="grid gap-6">
    {/* Hero and About Images */}
    {['heroImage', 'aboutImage'].map((key) => (
      <div key={key} className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4 capitalize text-gray-800">
          {key.replace(/([A-Z])/g, ' $1').trim()} Image
        </h3>
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImageUpload(key, file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended: JPEG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-800">
              Preview
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center">
  {images[key] ? (
    <img
      src={`${API_BASE}/api/images.php?action=getImage&key=${key}`}
      alt="Preview"
      className="max-h-40 max-w-full object-contain"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  ) : (
    <div className="text-gray-400 text-center">
      <Image size={32} className="mx-auto mb-2" />
      <p>No image uploaded</p>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    ))}

    {/* Service Images */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Service Images</h2>
      <p className="text-gray-600 mb-6">Upload images for up to 10 popular services</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 10 }, (_, index) => {
          const key = `service${index + 1}Image`;
          return (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium mb-3 text-gray-800">
                Service {index + 1} Image
                {content.services?.[index]?.title && (
                  <span className="text-sm text-gray-500 block mt-1">
                    {content.services[index].title}
                  </span>
                )}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(key, file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 h-32 flex items-center justify-center">
                    {images[key] ? (
                      <img
                        src={images[key]}
                        alt={`Service ${index + 1}`}
                        className="max-h-24 max-w-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Image size={24} className="mx-auto mb-1" />
                        <p className="text-xs">No image</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Reset Content</h3>
                <p className="text-gray-600 mb-4">
                  Reset all content to default values. This will overwrite all current content.
                </p>
                <button
                  onClick={resetContent}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reset to Default Content
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">System Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>API Base URL:</strong> {API_BASE}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Storage:</strong> Database (MySQL)
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Authentication:</strong> Token-based
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Enhanced Global Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        /* Smooth transitions */
        * {
          transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }

        /* Custom scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Loading animation */
        .shimmer {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
        }

        /* Enhanced focus states */
        input:focus, select:focus, textarea:focus {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        /* Hover effects */
        .hover-lift:hover {
          transform: translateY(-2px);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #65a30d 0%, #16a34a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}