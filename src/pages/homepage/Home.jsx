import Footer from "./Footer";
import { showToast } from "../../lib/toast";
import { useNavigate, useLocation } from "react-router-dom";
import { ProductContext, AuthContext } from "../../context/Context";
import { useContext, useState, useEffect, useRef } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Home() {
  const { wishList, addToWishList, removeFromWishList, products } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Best Sellers Carousel Refs and State
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const bestSellers = products.filter((product) => product.bestseller);
  const productWidth = 256; // w-64 = 256px
  const gap = 24; // space-x-6 = 24px

  // Clone products for infinite loop effect
  const duplicatedBestSellers = [...bestSellers, ...bestSellers, ...bestSellers];

  const scrollToIndex = (index) => {
    if (!scrollRef.current || bestSellers.length === 0) return;
    
    const container = scrollRef.current;
    const scrollPosition = index * (productWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentIndex(index % bestSellers.length);
  };

  const scroll = (direction) => {
    if (bestSellers.length === 0) return;

    let newIndex;
    if (direction === "left") {
      newIndex = currentIndex === 0 ? bestSellers.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === bestSellers.length - 1 ? 0 : currentIndex + 1;
    }
    
    scrollToIndex(newIndex);
  };

  // Auto-scroll functionality with proper looping
  useEffect(() => {
    if (bestSellers.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 2000);

    return () => clearInterval(interval);
  }, [bestSellers.length, isPaused, currentIndex]);

  // Initialize scroll position to middle section
  useEffect(() => {
    if (scrollRef.current && bestSellers.length > 0) {
      // Start in the middle section for infinite scroll illusion
      scrollRef.current.scrollLeft = bestSellers.length * (productWidth + gap);
    }
  }, [bestSellers.length]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-end pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://wallpapercave.com/wp/wp5633257.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="lg:w-2/3">
            <h2 className="text-4xl md:text-7xl mb-4 px-3 text-white">
              Earned. Not given.
            </h2>
            <div className="mt-6 flex gap-4">
              <Link
                to="/collections"
                className="bg-black text-3xl text-white hover:text-gray-500 px-3 py-3 inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-xl mb-8 text-center">As Seen In</h2>
          <div className="flex flex-wrap justify-around gap-8 md:gap-16">
            <img
              className="w-20"
              src="https://i.pinimg.com/1200x/3f/0d/16/3f0d16bf68e328595b30586498c509fb.jpg"
              alt="Air Jordan"
            />
            <img
              className="w-20"
              src="https://i.pinimg.com/736x/ca/4b/01/ca4b013a4dbff8259a4891f8ffebee8b.jpg"
              alt="Cactus-Jack"
            />
            <img
              className="w-20"
              src="https://i.pinimg.com/1200x/22/3f/13/223f13ede4c148eb56f1c0e750339205.jpg"
              alt="SB"
            />
            <img
              className="w-20"
              src="https://i.pinimg.com/736x/2d/43/7d/2d437dc9da15696effc38893adb68e31.jpg"
              alt="Air"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Header */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <h2 className="text-3xl mb-4 text-red-400 lg:mb-0">Best Sellers</h2>
          </div>
        </div>
      </section>

      {/* Enhanced Best Sellers Carousel with Proper Looping */}
      <section 
        className="py-8 bg-white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Minimal Arrow Buttons */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 hidden sm:flex z-10 transition-all duration-200 hover:scale-110"
            >
              <span className="text-lg font-bold text-gray-700">‹</span>
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 hidden sm:flex z-10 transition-all duration-200 hover:scale-110"
            >
              <span className="text-lg font-bold text-gray-700">›</span>
            </button>

            {/* Scroll Indicators */}
            {bestSellers.length > 0 && (
              <div className="flex justify-center space-x-2 mb-6">
                {bestSellers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-gray-800 w-6" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Products Scroll Container with Duplicated Items for Infinite Effect */}
            <div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {bestSellers.length > 0 ? (
                duplicatedBestSellers.map((product, index) => {
                  const inWishList = wishList.includes(product.id);

                  return (
                    <div
                      key={`${product.id}-${index}`}
                      className="w-64 flex-shrink-0 group relative"
                    >
                      <div className="relative h-80 w-64 overflow-hidden">
                        <Link to={`/productdetails/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-100 hover:opacity-0"
                          />
                          <img
                            src={product.image2}
                            alt={product.name}
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 hover:opacity-100"
                          />
                        </Link>

                        <button
                          onClick={() => {
                            if (!user) {
                              showToast.error("User not Logged in");
                              navigate("/login", {
                                state: { from: location.pathname },
                              });
                            } else
                              inWishList
                                ? removeFromWishList(product.id)
                                : addToWishList(product.id);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                        >
                          {inWishList ? (
                            <HeartSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartOutline className="h-5 w-5 text-gray-600 hover:text-red-500" />
                          )}
                        </button>

                        <div className="absolute top-2 left-2 bg-white text-red-400 px-2 py-1 text-xs font-medium">
                          Best Seller
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-gray-600">
                              {product.category}
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            ${product.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center py-12 text-gray-500">
                  No best sellers available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your existing sections remain the same */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl text-gray-700">
                <i className="klbth-icon-box-4"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Free Shipping
                </h4>
                <p className="text-gray-600 text-sm">
                  Free Shipping To Almost All Cities
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl text-gray-700">
                <i className="klbth-icon-delivery-return"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Quality Guarantee
                </h4>
                <p className="text-gray-600 text-sm">
                  Within 2-3 days for an exchange.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl text-gray-700">
                <i className="klbth-icon-support"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Online Support
                </h4>
                <p className="text-gray-600 text-sm">Dedicated support</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl text-gray-700">
                <i className="klbth-icon-credit-card"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Flexible Payment
                </h4>
                <p className="text-gray-600 text-sm">
                  Multiple Payment Options
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative">
          <div style={{ paddingBottom: "125%" }}>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src="https://i.pinimg.com/736x/d5/a2/8f/d5a28f53610107c9edaf8928bea6a8a7.jpg"
              alt="AJ Chicago poster"
            />
          </div>
        </div>
        <div className="relative">
          <div style={{ paddingBottom: "125%" }}>
            <div className="absolute inset-0 w-full h-full">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://i.pinimg.com/1200x/08/bb/4e/08bb4e52208200b384b4cbfcbd8fbb8e.jpg"
                alt="AJ Chicago"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-start justify-start p-8">
            <div className="text-2xl font-medium text-white bg-black/50 px-4 py-2 rounded">
              OG 'Chicago'
            </div>
          </div>
        </div>
      </section>

      <div className="h-32"></div>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative">
          <div style={{ paddingBottom: "125%" }}>
            <div className="absolute inset-0 w-full h-full">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://i.pinimg.com/1200x/e4/b2/cb/e4b2cb9e88f504889cbf7fbe7e6c26d1.jpg"
                alt="Sneaker collection"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <div style={{ paddingBottom: "125%" }}>
            <div className="absolute inset-0 w-full h-full">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://i.pinimg.com/736x/ca/60/ce/ca60ceafc5c55cd0f7c2f27ed664b882.jpg"
                alt="Sneaker poster"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-start justify-start p-8">
            <Link 
              to="/collections"
              className="text-2xl font-medium text-white bg-black/50 px-4 py-2 rounded hover:bg-black/70 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      <div className="h-24"></div>

      <div className="flex justify-center">
        <p className="text-5xl md:text-7xl font-bold text-center px-4">JUST DO IT.</p>
      </div>

      <div className="h-24"></div>

      <section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {products.slice(0, 18).map((product) => {
              const inWishList = wishList.includes(product.id);
              return (
                <div key={product.id} className="group relative">
                  <div className="relative" style={{ paddingTop: "125%" }}>
                    <Link to={`/productdetails/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-100 hover:opacity-0"
                      />
                      <img
                        src={product.image2}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 hover:opacity-100"
                      />
                    </Link>

                    <button
                      onClick={() => {
                        if (!user) {
                          showToast.error("User not Logged in");
                          navigate("/login", {
                            state: { from: location.pathname },
                          });
                        } else
                          inWishList
                            ? removeFromWishList(product.id)
                            : addToWishList(product.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                    >
                      {inWishList ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartOutline className="h-5 w-5 text-gray-600 hover:text-red-500" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-gray-600 text-sm">{product.category}</div>
                    <div className="font-medium">${product.price}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 py-8 text-right">
            <Link 
              to="/collections" 
              className="text-black hover:text-gray-600 font-medium transition-colors"
            >
              View all products →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}