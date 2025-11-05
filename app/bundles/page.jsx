"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Star, Clock, CheckCircle } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lizlyskincare.sbs";

export default function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/bundles2.php?action=getAll&active_only=true`
      );
      const data = await response.json();

      if (data.success) {
        // Filter only active bundles with valid dates
        const activeBundles =
          data.data.bundles?.filter((bundle) => {
            const today = new Date();
            const validFrom = bundle.valid_from
              ? new Date(bundle.valid_from)
              : new Date("1970-01-01");
            const validTo = bundle.valid_to
              ? new Date(bundle.valid_to)
              : new Date("2099-12-31");

            return (
              bundle.status === "active" &&
              today >= validFrom &&
              today <= validTo
            );
          }) || [];

        setBundles(activeBundles);
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  const calculateTotalSavings = (bundle) => {
    const totalOriginalPrice =
      bundle.services?.reduce((total, service) => total + service.price, 0) ||
      0;
    return {
      totalOriginal: totalOriginalPrice,
      savings: totalOriginalPrice - bundle.price,
      savingsPercentage: Math.round(
        ((totalOriginalPrice - bundle.price) / totalOriginalPrice) * 100
      ),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading Bundles...</p>
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
                <Package className="text-lime-700" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Lizly Bundles
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
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Treatment Bundles & Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save more with our specially curated treatment packages
          </p>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {bundles.length === 0 ? (
            <div className="text-center py-16">
              <Package size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No Active Bundles
              </h3>
              <p className="text-gray-500 mb-8">
                Check back later for special treatment packages!
              </p>
              <Link
                href="/services"
                className="bg-lime-600 text-white px-8 py-3 rounded-full hover:bg-lime-700 transition-colors"
              >
                View All Services
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {bundles.map((bundle, index) => {
                const savings = calculateTotalSavings(bundle);

                return (
                  <div
                    key={bundle.bundle_id}
                    className={`bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden transition-all duration-500 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Bundle Header */}
                    <div className="bg-gradient-to-r from-lime-600 to-green-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{bundle.name}</h3>
                        {savings.savings > 0 && (
                          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                            Save {savings.savingsPercentage}%
                          </div>
                        )}
                      </div>
                      <p className="text-purple-100 text-sm">
                        {bundle.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="p-4 bg-lime-50 border-b border-green-200">
                      <div className="flex items-end gap-2">
                        {savings.totalOriginal > bundle.price && (
                          <span className="text-lg text-gray-500 line-through">
                            ₱{savings.totalOriginal}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-green-600">
                          ₱{bundle.price}
                        </span>
                        <span className="text-sm text-gray-600">bundle</span>
                      </div>
                      {savings.savings > 0 && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          You save ₱{savings.savings}
                        </p>
                      )}
                    </div>

                    {/* Validity Period */}
                    <div className="p-4 bg-green-50 border-b border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Clock size={16} />
                          {bundle.valid_from && bundle.valid_to ? (
                            <>
                              {new Date(bundle.valid_from).toLocaleDateString()}{" "}
                              - {new Date(bundle.valid_to).toLocaleDateString()}
                            </>
                          ) : bundle.valid_to ? (
                            <>
                              Valid until{" "}
                              {new Date(bundle.valid_to).toLocaleDateString()}
                            </>
                          ) : (
                            "Ongoing bundle"
                          )}
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(bundle.valid_to) < new Date()
                              ? "bg-red-100 text-red-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {new Date(bundle.valid_to) < new Date()
                            ? "Expired"
                            : "Active"}
                        </div>
                      </div>
                    </div>

                    {/* Included Services */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        Included Services ({bundle.services?.length || 0})
                      </h4>

                      <div className="space-y-3">
                        {bundle.services?.map((service) => (
                          <div
                            key={service.service_id}
                            className="border border-gray-200 rounded-lg p-3"
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
                                <span className="text-xs text-gray-500 line-through">
                                  ₱{service.price}
                                </span>
                                <p className="text-xs text-green-600 font-medium">
                                  Included
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
