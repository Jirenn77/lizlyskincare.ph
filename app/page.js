"use client";

import Link from "next/link";
import {
  Leaf,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Phone,
  ChevronDown,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lizlyskincare.sbs";

export default function Home() {
  const [images, setImages] = useState({
    heroImage: null,
    aboutImage: null,
    service1Image: null,
    service2Image: null,
    service3Image: null,
    service4Image: null,
    service5Image: null,
    service6Image: null,
    service7Image: null,
    service8Image: null,
    service9Image: null,
    service10Image: null,
  });
  const [content, setContent] = useState(null);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const sectionRefs = useRef([]);
  const [servicesDropdown, setServicesDropdown] = useState(false);
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

  // Function to add ref to each section
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const defaultContent = {
    hero: {
      title: "Radiant Skin ",
      subtitle:
        "Experience professional skin care treatments tailored to your unique needs. Our expert dermatologists help you achieve healthy, glowing skin.",
    },
    services: [
      {
        title: "Facial Treatments",
        description:
          "Customized facials for deep cleansing, hydration, and rejuvenation.",
        features: [
          "Hydrating Facials",
          "Anti-Aging Treatments",
          "Acne Solutions",
          "Brightening Therapy",
        ],
      },
      {
        title: "Laser Therapy",
        description:
          "Advanced laser treatments for skin resurfacing and pigmentation.",
        features: [
          "Laser Hair Removal",
          "Skin Resurfacing",
          "Pigment Correction",
          "Scar Treatment",
        ],
      },
      {
        title: "Skin Consultation",
        description:
          "Personalized skin analysis and treatment plans by expert dermatologists.",
        features: [
          "Skin Analysis",
          "Custom Treatment Plans",
          "Product Recommendations",
          "Follow-up Care",
        ],
      },
    ],
    
    contact: {
      phone: "(555) 123-4567",
      email: "info@lizlyskincare.com",
      address: "123 Beauty Street, City, State 12345",
    },
  };

  const currentContent = content || defaultContent;

  // Add scroll event listener to update current page - MOVED AFTER currentContent is defined
  useEffect(() => {
    const scrollContainer = document.getElementById("services-scroll");

    const handleScroll = () => {
      if (scrollContainer) {
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth =
          scrollContainer.querySelector("div")?.offsetWidth + 24;
        const currentPage = Math.floor(scrollLeft / (cardWidth * 4)) + 1;
        setCurrentServicePage(currentPage);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [currentContent.services]); // Now currentContent is defined

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

    useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      // Load images
      const imagesResponse = await fetch(
        `${API_BASE}/images.php?action=getAll`
      );
      const imagesData = await imagesResponse.json();
      console.log("Images API response:", imagesData);

      if (imagesData.success && imagesData.data && imagesData.data.images) {
        const loadedImages = {};
        Object.entries(imagesData.data.images).forEach(([key, imageInfo]) => {
          if (imageInfo && imageInfo.url) {
            loadedImages[key] = imageInfo.url.startsWith("http")
              ? imageInfo.url
              : `${API_BASE}/${imageInfo.url}`;
          }
        });
        setImages(loadedImages);
      }

      // Load content
      const contentResponse = await fetch(
        `${API_BASE}/content.php?action=getAll`
      );
      const contentData = await contentResponse.json();
      console.log("Content API response:", contentData);

      if (
        contentData.success &&
        contentData.data &&
        contentData.data.content
      ) {
        setContent(contentData.data.content);
      }

      // Load memberships
      await loadMemberships();
      
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  loadData();
}, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-scroll-in");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll(".scroll-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading Beauty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm transition-all duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
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
            </div>

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
                                  <a
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
                                  </a>

                                  <a
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
                                  </a>
                                </div>
                              </div>

                              <div>
                                <a
                                  href="/services"
                                  className="block py-2 px-3 rounded-lg bg-lime-50 text-lime-700 font-semibold transition-all duration-200 group hover:bg-lime-100 mt-2"
                                >
                                  <span className="text-sm">
                                    View All Services →
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-gray-600 hover:text-lime-600 transition-all duration-300 font-medium relative group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {item}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-600 transition-all duration-300 group-hover:w-full"></span>
                      </a>
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

      {/* Hero Section */}
      <section
        id="home"
        className="scroll-section pt-20 bg-gradient-to-br from-lime-50 via-lime-100 to-green-50"
      >
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-6 transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                {currentContent.hero.title || "Radiant Skin"}{" "}
                <span className="bg-gradient-to-r from-lime-700 to-green-700 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {currentContent.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-gradient-to-r from-lime-700 to-green-700 text-white px-8 py-4 rounded-full hover:from-lime-800 hover:to-green-600 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <span>Contact Us</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-lime-400 to-green-400 rounded-2xl blur-xl opacity-20"></div>
                <img
                  src={`${API_BASE}/images.php?action=getImage&key=heroImage`}
                  alt="Lizly Skin Care Clinic"
                  className="relative rounded-2xl h-96 w-full object-cover shadow-xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="scroll-section py-20 bg-white"
        ref={addToRefs}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after treatments with advanced technology
            </p>
          </div>

          <div className="relative">
            {/* Navigation Buttons - Show only if there are more than 4 services */}
            {currentContent.services?.length > 4 && (
              <>
                <button
                  onClick={() => handleServiceScroll("prev")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-lime-50 transition-colors border border-lime-200 hover:shadow-xl"
                >
                  <ArrowRight size={24} className="text-lime-700 rotate-180" />
                </button>

                <button
                  onClick={() => handleServiceScroll("next")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-lime-50 transition-colors border border-lime-200 hover:shadow-xl"
                >
                  <ArrowRight size={24} className="text-lime-700" />
                </button>
              </>
            )}

            {/* Scrollable Services Container - Limited to 10 services */}
            <div
              id="services-scroll"
              className="flex gap-6 overflow-x-hidden pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {currentContent.services?.slice(0, 10).map((service, index) => (
                <div
                  key={index}
                  className="scroll-section w-[calc(25%-18px)] min-w-[280px] bg-lime-50 p-6 rounded-2xl shadow-lg border border-lime-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Service Image */}
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-lime-400 to-green-400 rounded-2xl blur-xl opacity-20"></div>
                    <div className="relative rounded-xl h-40 w-full bg-gradient-to-br from-lime-100 to-green-100 flex items-center justify-center shadow-lg border border-lime-200 overflow-hidden">
                      {images[`service${index + 1}Image`] ? (
<img
  src={images[`service${index + 1}Image`] || `/api/images.php?action=getImage&key=service${index + 1}Image`}
  alt={service.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.style.display = "none";
    // Show fallback content
    e.target.nextElementSibling?.style?.display = 'flex';
  }}
/>
                      ) : null}

                      {/* Fallback content that shows when no image or image fails */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center p-4 ${
                          images[`service${index + 1}Image`]
                            ? "bg-white/80 opacity-0 hover:opacity-100 transition-opacity duration-300"
                            : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-10 h-10 bg-lime-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Sparkles className="text-lime-700" size={20} />
                          </div>
                          <span className="text-lime-700 font-semibold text-sm line-clamp-2">
                            {service.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-lime-600 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                    {service.description}
                  </p>
                  <ul className="text-gray-700 space-y-1 mb-4 text-sm">
                    {service.features
                      ?.slice(0, 3)
                      .map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-lime-700 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    {service.features?.length > 3 && (
                      <li className="flex items-center text-lime-600 font-medium text-xs">
                        <div className="w-1.5 h-1.5 bg-lime-700 rounded-full mr-2"></div>
                        +{service.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                  <button className="bg-gradient-to-r from-lime-700 to-green-700 bg-clip-text text-transparent font-semibold hover:from-lime-600 hover:to-green-600 transition-all duration-300 text-sm">
                    Learn More →
                  </button>
                </div>
              ))}
            </div>

            {/* Page Indicators */}
            {currentContent.services?.length > 4 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {Array.from(
                  {
                    length: Math.ceil(
                      Math.min(currentContent.services?.length, 10) / 4
                    ),
                  },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToServicePage(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentServicePage === i + 1
                          ? "bg-lime-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* View All Services Button */}
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-block border-2 border-lime-700 text-lime-700 px-8 py-3 rounded-full hover:bg-lime-700 hover:text-white transition-all duration-300 font-medium"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="scroll-section py-20 bg-gradient-to-br from-lime-100 to-green-50"
        ref={addToRefs}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={`${API_BASE}/images.php?action=getImage&key=aboutImage`}
                alt="Clinic Interior"
                className="rounded-2xl h-96 w-full object-cover shadow-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Lizly Skin Care?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Expert Dermatologists",
                    desc: "Our team consists of certified dermatologists with years of experience.",
                  },
                  {
                    title: "Advanced Technology",
                    desc: "We use the latest medical-grade equipment for optimal results.",
                  },
                  {
                    title: "Personalized Care",
                    desc: "Every treatment plan is customized to your specific skin needs.",
                  },
                  {
                    title: "Natural Results",
                    desc: "We focus on enhancing your natural beauty with subtle, effective treatments.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="scroll-section flex items-start space-x-4"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-lime-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-lime-600">
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Memberships Section */}
<section
  id="memberships"
  className="scroll-section py-20 bg-white"
  ref={addToRefs}
>
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Our Memberships
      </h2>
      <p className="text-xl text-gray-600">
        Choose the plan that works best for you
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Basic Membership */}
      <div
        className="scroll-section bg-gradient-to-b from-lime-50 to-white p-8 rounded-2xl shadow-lg border border-lime-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        style={{ animationDelay: "0ms" }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{memberships.basic.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-lime-700">₱{memberships.basic.price}</span>
          </div>
          <p className="text-gray-600 mt-2">Consumable Amount: ₱{memberships.basic.consumable}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {memberships.basic.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-lime-700 text-sm">✓</span>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
      </div>

      {/* Pro Membership */}
      <div
        className="scroll-section bg-gradient-to-b from-green-50 to-white p-8 rounded-2xl shadow-2xl border border-green-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-105 relative"
        style={{ animationDelay: "200ms" }}
      >
        <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm font-medium">
          MOST POPULAR
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{memberships.pro.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-green-700">₱{memberships.pro.price}</span>
          </div>
          <p className="text-gray-600 mt-2">Consumable Amount: ₱{memberships.pro.consumable}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {memberships.pro.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-700 text-sm">✓</span>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
      </div>

      {/* Promo Membership */}
      <div
        className="scroll-section bg-gradient-to-b from-yellow-50 to-white p-8 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        style={{ animationDelay: "400ms" }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{memberships.promo.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-yellow-600">{memberships.promo.price}</span>
          </div>
          <p className="text-gray-600 mt-2">{memberships.promo.consumable} pricing & benefits</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {memberships.promo.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
      </div>
    </div>

    <div className="text-center mt-8">
      <p className="text-gray-600">
        All memberships include personalized consultations and flexible scheduling
      </p>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section
        className="scroll-section py-20 bg-gradient-to-r from-lime-700 to-green-700 text-white"
        ref={addToRefs}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Skin Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get in touch with our expert dermatologists and discover the perfect
            treatment plan for your skin needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 text-lg font-medium">
              Visit Us Now!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="scroll-section bg-gray-900 text-white py-12"
        ref={addToRefs}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-3 bg-lime-200 rounded-xl">
                  <Leaf className="text-lime-800" size={35} />
                </div>
                <span className="text-2xl font-bold">Lizly</span>
                <span className="text-sm bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                  Skin Care
                </span>
              </div>
              <p className="text-gray-400">
                Professional skin care clinic dedicated to helping you achieve
                your beauty goals.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#home"
                    className="hover:text-lime-600 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-lime-600 transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-lime-600 transition-colors"
                  >
                    About
                  </a>
                </li>
               <li>
  <a
    href="#memberships"
    className="hover:text-lime-600 transition-colors"
  >
    Memberships
  </a>
</li>

              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{currentContent.contact?.phone}</li>
                <li>{currentContent.contact?.email}</li>
                <li>{currentContent.contact?.address}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mon-Fri: 9AM-6PM</li>
                <li>Saturday-Sunday: 10AM-4PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Lizly Skin Care Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced CSS animations */}
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
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .scroll-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .animate-scroll-in {
          opacity: 1;
          transform: translateY(0);
          animation: popIn 0.8s ease-out forwards;
        }

        /* Staggered animations for children */
        .scroll-section:nth-child(odd) {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .scroll-section:nth-child(even) {
          animation: slideInRight 0.8s ease-out forwards;
        }

        /* Smooth scrolling for the whole page */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #84cc16, #16a34a);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #65a30d, #15803d);
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
