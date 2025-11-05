"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Star, Clock, CheckCircle } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/APIpage";

export default function PromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
  try {
    console.log('🔍 Starting fetchPromos...');
    console.log('📡 API URL:', `${API_BASE}/promos.php?action=getAll`);
    
    const response = await fetch(`${API_BASE}/promos.php?action=getAll`);
    console.log('📊 Response status:', response.status, response.ok);
    
    const data = await response.json();
    console.log('📦 Full API response:', data);
    
    if (data.success) {
      console.log('✅ API success, raw promos:', data.data.promos);
      
      const today = new Date();
      console.log('📅 Today\'s date:', today.toISOString());
      
      // Filter only active promos with valid dates
      const activePromos = data.data.promos?.filter(promo => {
        console.log('🔍 Checking promo:', promo.name);
        console.log('   Status:', promo.status);
        console.log('   Valid from:', promo.valid_from);
        console.log('   Valid to:', promo.valid_to);
        
        // Check status
        if (promo.status !== 'active') {
          console.log('   ❌ Filtered out - status not active');
          return false;
        }
        
        // Check date validity
        const validFrom = promo.valid_from ? new Date(promo.valid_from) : new Date('1970-01-01');
        const validTo = promo.valid_to ? new Date(promo.valid_to) : new Date('2099-12-31');
        
        console.log('   Valid From (parsed):', validFrom.toISOString());
        console.log('   Valid To (parsed):', validTo.toISOString());
        console.log('   Today >= Valid From:', today >= validFrom);
        console.log('   Today <= Valid To:', today <= validTo);
        
        const isValidDate = today >= validFrom && today <= validTo;
        
        if (!isValidDate) {
          console.log('   ❌ Filtered out - date range invalid');
        } else {
          console.log('   ✅ Promo is valid and active');
        }
        
        return isValidDate;
      }) || [];
      
      console.log('🎯 Final active promos:', activePromos);
      setPromos(activePromos);
    } else {
      console.error('❌ API returned error:', data.error);
    }
  } catch (error) {
    console.error('💥 Error fetching promos:', error);
  } finally {
    setLoading(false);
    setTimeout(() => setIsVisible(true), 100);
  }
};

  const calculateSavings = (service, promo) => {
    if (promo.discount_type === "percentage") {
      const discountAmount = (service.price * promo.discount_value) / 100;
      return {
        original: service.price,
        discounted: service.price - discountAmount,
        savings: discountAmount,
      };
    } else {
      return {
        original: service.price,
        discounted: Math.max(0, service.price - promo.discount_value),
        savings: promo.discount_value,
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading Promos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="p-2 bg-lime-200 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Tag className="text-lime-700" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Lizly Promos
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-lime-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lime-50 to-green-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Special Promos & Discounts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Limited time offers and exclusive discounts on our most popular
            treatments
          </p>
        </div>
      </section>

      {/* Promos Grid */}
<section className="py-16">
  <div className="container mx-auto px-6">
    {promos.length === 0 ? (
      <div className="text-center py-16">
        <Tag size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-600 mb-4">
          No Active Promos
        </h3>
        <p className="text-gray-500 mb-8">
          Check back later for special offers and discounts!
        </p>
        <Link
          href="/services"
          className="bg-lime-700 text-white px-8 py-3 rounded-full hover:bg-lime-700 transition-colors"
        >
          View All Services
        </Link>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promos.map((promo, index) => (
          <div
            key={promo.promo_id}
            className={`bg-white rounded-2xl shadow-lg border border-lime-300 overflow-hidden transition-all duration-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* Promo Header */}
            <div className="bg-gradient-to-r from-lime-600 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{promo.name}</h3>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {promo.discount_type === "percentage"
                    ? `${promo.discount_value}% OFF`
                    : `₱${promo.discount_value} OFF`}
                </div>
              </div>
              <p className="text-lime-100 text-sm">
                {promo.description}
              </p>
            </div>

            {/* Validity Period */}
            <div className="p-4 bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Clock size={16} />
                  {promo.valid_from && promo.valid_to ? (
                    <>
                      {new Date(promo.valid_from).toLocaleDateString()} -{" "}
                      {new Date(promo.valid_to).toLocaleDateString()}
                    </>
                  ) : promo.valid_to ? (
                    <>
                      Valid until{" "}
                      {new Date(promo.valid_to).toLocaleDateString()}
                    </>
                  ) : (
                    "Ongoing promotion"
                  )}
                </div>

                {/* Status Badge */}
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    new Date(promo.valid_to) < new Date()
                      ? "bg-red-100 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {new Date(promo.valid_to) < new Date()
                    ? "Expired"
                    : "Active"}
                </div>
              </div>
            </div>

            {/* Applicable Services */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-lime-500" />
                Applicable Services ({promo.services?.length || 0})
              </h4>

              <div className="space-y-3">
                {promo.services?.slice(0, 3).map((service) => {
                  const savings = calculateSavings(service, promo);
                  return (
                    <div
                      key={service.service_id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-lime-200 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">
                            {service.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {service.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 line-through">
                              ₱{savings.original}
                            </span>
                            <span className="text-sm font-bold text-lime-600">
                              ₱{savings.discounted}
                            </span>
                          </div>
                          <p className="text-xs text-lime-600 font-medium">
                            Save ₱{savings.savings}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {promo.services?.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-lime-500 font-medium">
                      +{promo.services.length - 3} more services
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Button */}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
    </div>
  );
}
