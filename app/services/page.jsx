"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight, ChevronDown, Leaf, X } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lizlyskincare.sbs";

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const handleServiceScroll = (direction) => {
    const scrollContainer = document.getElementById("services-scroll");
    const serviceCards = document.querySelectorAll("#services-scroll > div");
    const cardWidth = serviceCards[0]?.offsetWidth + 24; // 24px for gap

    if (scrollContainer && serviceCards.length > 0) {
      const scrollAmount = cardWidth * 4; // Scroll 4 cards at a time

      if (direction === "next") {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setCurrentServicePage((prev) =>
          Math.min(prev + 1, Math.ceil(serviceCards.length / 4))
        );
      } else {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setCurrentServicePage((prev) => Math.max(prev - 1, 1));
      }
    }
  };

  const scrollToServicePage = (pageIndex) => {
    const scrollContainer = document.getElementById("services-scroll");
    const serviceCards = document.querySelectorAll("#services-scroll > div");
    const cardWidth = serviceCards[0]?.offsetWidth + 24; // 24px for gap

    if (scrollContainer && serviceCards.length > 0) {
      const scrollPosition = pageIndex * cardWidth * 4;
      scrollContainer.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentServicePage(pageIndex + 1);
    }
  };

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    fetchServices();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    filterServices();
    setCurrentPage(1); // Reset to first page when filters change
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/services.php?action=getAll`);
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data.services || []);
      } else {
        console.error("Failed to fetch services:", data.error);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const categories = ["All", ...new Set(services.map(service => service.category).filter(Boolean))];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration) return "Varies";
    if (duration < 60) return `${duration} mins`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  // Animated page change function
  const changePage = (newPage) => {
    if (newPage === currentPage || isAnimating) return;
    
    setIsAnimating(true);
    
    // Add a small delay to show the animation
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsAnimating(false);
    }, 300);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Background Elements - Same as Home Page */}
<div className="fixed inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-40 -right-32 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
  <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
</div>

{/* Navigation - Enhanced with Dropdown like Home Page */}
<nav
  className={`fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm transition-all duration-500 ${
    isVisible ? "translate-y-0" : "-translate-y-full"
  }`}
>
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
        <div className="p-3 bg-lime-200 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          <Leaf className="text-lime-700" size={32} />
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-800 block">
            Lizly
          </span>
          <span className="text-sm bg-gradient-to-r from-lime-700 to-green-600 bg-clip-text text-transparent font-medium">
            Skin Care
          </span>
        </div>
      </Link>

      <div className="hidden md:flex space-x-8">
        {["Home", "Services", "About", "Memberships"].map(
          (item, index) => (
            <div key={item} className="relative">
              {item === "Services" ? (
                <div
                  onMouseEnter={() => setServicesDropdown(true)}
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="relative"
                >
                  <button className="text-gray-600 hover:text-lime-600 transition-all duration-300 font-medium flex items-center space-x-1 group">
                    <span>{item}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        servicesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Services Dropdown Menu */}
                  {servicesDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-lime-100 z-50 animate-scaleIn">
                      <div className="p-4">
                        <div className="mb-3 pb-2 border-b border-lime-100">
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide text-lime-700">
                            Special Offers
                          </h3>
                          <div className="space-y-2">
                            <Link
                              href="/promos"
                              className="block py-2 px-3 rounded-lg hover:bg-lime-50 transition-all duration-200 group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 group-hover:text-lime-700 font-medium">
                                  Seasonal Promos
                                </span>
                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                  HOT
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Limited time discounts
                              </p>
                            </Link>

                            <Link
                              href="/bundles"
                              className="block py-2 px-3 rounded-lg hover:bg-lime-50 transition-all duration-200 group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 group-hover:text-lime-700 font-medium">
                                  Treatment Bundles
                                </span>
                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  SAVE
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Package deals & savings
                              </p>
                            </Link>
                          </div>
                        </div>

                        <div>
                          <Link
                            href="/services"
                            className="block py-2 px-3 rounded-lg bg-lime-50 text-lime-700 font-semibold transition-all duration-200 group hover:bg-lime-100 mt-2"
                          >
                            <span className="text-sm">
                              View All Services →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-lime-600 transition-all duration-300 font-medium relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </div>
          )
        )}
      </div>

      <button 
        onClick={() => setShowContactModal(true)}
        className="bg-gradient-to-r from-lime-600 to-green-600 text-white px-6 py-3 rounded-full hover:from-lime-700 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Contact Us
      </button>
    </div>
  </div>
</nav>

      {/* Contact Modal */}
{showContactModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Contact Our Branches
          </h3>
          <button
            onClick={() => setShowContactModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={30} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Contact Info */}
          <div className="bg-lime-50 p-4 rounded-xl border border-lime-200">
            <h4 className="font-semibold text-lime-700 mb-2">
              Main Contact Information
            </h4>
            <p className="text-gray-700">
              📞 Phone: <strong>09659689481</strong>
            </p>
            <p className="text-gray-700">
              📧 Email: <strong>lizlyskincare@gmail.com</strong>
            </p>
          </div>

          {/* Social Media */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-700 mb-3">
              Follow Us!
            </h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                {" "}
                TikTok: <strong>@lizlyskincare</strong>
              </p>
              <p className="text-gray-700">
                {" "}
                YouTube: <strong>lizlyskincareclinic.youtube.com</strong>
              </p>
              <p className="text-gray-700">
                {" "}
                Facebook: <strong>Lizly Skincare</strong>
              </p>
            </div>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Our Branches
            </h4>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-green-700 mb-2">
                  CDO Main Branch
                </h5>
                <p className="text-gray-700 text-sm">
                  Condoy Building Room 201, Pabayo Gomez Street, CDO
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📞 09659689481
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-green-700 mb-2">
                  Gingoog City Branch
                </h5>
                <p className="text-gray-700 text-sm">
                  CV Lugod Street, Gingoog City
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📞 09659689481
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-green-700 mb-2">
                  Camp Evangelista Branch
                </h5>
                <p className="text-gray-700 text-sm">
                  Zone-1 Crossing Camp Evangelista
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📞 09659689481
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-green-700 mb-2">
                  Patag CDO Branch
                </h5>
                <p className="text-gray-700 text-sm">
                  Gwen's Place 3rd Door Patag, CDO
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📞 09659689481
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-green-700 mb-2">
                  Manolo Fortich Branch
                </h5>
                <p className="text-gray-700 text-sm">
                  Ostrea Building Door 2, L Binauro Street Tankulan Manolo
                  Fortich Bukidnon
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📞 09659689481
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Header - Adjusted for navigation spacing */}
      <div className="bg-white shadow-sm border-b pt-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Services</h1>
                <p className="text-gray-600">Discover our complete range of treatments</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-lime-600">{currentServices.length}</span> of{" "}
                <span className="font-semibold text-lime-600">{filteredServices.length}</span> services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-900"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-gray-900" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Per Page Selector */}
            <div className="md:w-48">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 appearance-none bg-white text-gray-900"
                >
                  <option value={8}>8 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={16}>16 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid with Animation */}
      <div className="container mx-auto px-6 py-8">
        {currentServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
              isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}>
              {currentServices.map((service, index) => (
                <div
                  key={service.service_id}
                  className="bg-white rounded-2xl shadow-lg border border-lime-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 service-card"
                  style={{
                    animationDelay: isAnimating ? '0ms' : `${index * 100}ms`,
                    animation: isAnimating ? 'none' : 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-lime-100 text-lime-800 text-xs font-medium px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {service.name}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Price and Duration */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-lime-600">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formatDuration(service.duration)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => changePage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || isAnimating}
                    className={`p-2 rounded-lg border transition-all duration-300 transform ${
                      currentPage === 1 || isAnimating
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
                      disabled={isAnimating}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform ${
                        currentPage === page
                          ? 'bg-lime-600 border-lime-600 text-white scale-105 shadow-lg'
                          : `border-gray-300 text-gray-600 hover:bg-lime-50 hover:scale-110 active:scale-95 ${
                              isAnimating ? 'opacity-50' : 'opacity-100'
                            }`
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || isAnimating}
                    className={`p-2 rounded-lg border transition-all duration-300 transform ${
                      currentPage === totalPages || isAnimating
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
                    value={currentPage}
                    onChange={(e) => changePage(Number(e.target.value))}
                    disabled={isAnimating}
                    className={`border border-gray-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-lime-500 transition-all duration-300 ${
                      isAnimating ? 'opacity-50' : 'opacity-100'
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
        )}
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Can't find what you're looking for?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                 onClick={() => setShowContactModal(true)}
                className="bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-colors font-medium"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .service-card {
          opacity: 0;
          animation-fill-mode: forwards;
        }

        /* Smooth transitions for all interactive elements */
        button, select {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Loading animation for pagination */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .pagination-loading {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}