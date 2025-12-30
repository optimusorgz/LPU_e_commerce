'use client';

import { useState, useEffect, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Heart, TrendingUp, Clock, GraduationCap, Search, Package, CreditCard, Zap, Flame } from "lucide-react";
import { ProductService } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import type { Product } from '@/lib/types';

export default function Home() {
  const { user } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);
  const popularScrollRef = useRef<HTMLDivElement>(null);

  const backgroundImages = [
    {
      image: '/categories/electronics.png',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      image: '/categories/books.png',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      image: '/categories/furniture.png',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      image: '/categories/clothing.png',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      image: '/categories/sports.png',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  const categories = [
    {
      name: 'Electronics',
      gradient: 'from-blue-500 to-cyan-500',
      count: '250+',
      image: '/categories/electronics.png'
    },
    {
      name: 'Books',
      gradient: 'from-purple-500 to-pink-500',
      count: '180+',
      image: '/categories/books.png'
    },
    {
      name: 'Furniture',
      gradient: 'from-orange-500 to-red-500',
      count: '120+',
      image: '/categories/furniture.png'
    },
    {
      name: 'Clothing',
      gradient: 'from-green-500 to-teal-500',
      count: '200+',
      image: '/categories/clothing.png'
    },
    {
      name: 'Sports',
      gradient: 'from-yellow-500 to-orange-500',
      count: '90+',
      image: '/categories/sports.png'
    },
    {
      name: 'Accessories',
      gradient: 'from-pink-500 to-rose-500',
      count: '130+',
      image: '/categories/accessories.png'
    },
    {
      name: 'Kitchen',
      gradient: 'from-indigo-500 to-purple-500',
      count: '80+',
      image: null
    },
    {
      name: 'Other',
      gradient: 'from-gray-500 to-slate-500',
      count: '150+',
      image: null
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // Changed to 8000ms (8 seconds) for much slower transitions

    fetchProducts();

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAll('limit=10&sort=createdAt');
      setRecentProducts(response.data.products || []);

      const popularResponse = await ProductService.getAll('limit=10&sort=views');
      setPopularProducts(popularResponse.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (priceCents: number) => {
    return `₹${(priceCents / 100).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header transparent />

      {/* Full-Screen Hero Section with Carousel */}
      <section className="relative h-screen min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden">
        {backgroundImages.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
            style={{
              opacity: currentImage === index ? 1 : 0,
            }}
          >
            {/* Background Image - Fully Visible */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />
          </div>
        ))}

        {/* Subtle dark overlay for text readability - minimal */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="inline-block animate-bounce">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/30 flex items-center gap-1.5 sm:gap-2 w-fit mx-auto">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Students Only Marketplace</span>
                <span className="xs:hidden">Students Only</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white drop-shadow-2xl px-2">
              Buy & Sell on Campus
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Made Easy
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg px-2">
              The trusted marketplace for students. Find great deals on textbooks, electronics,
              furniture, and more from your fellow students.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base bg-white text-gray-900 hover:bg-gray-100 shadow-xl flex items-center justify-center gap-2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  Browse Products
                </Button>
              </Link>
              <Link href={user ? "/post" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  {user ? "Start Selling" : "Start Selling"}
                </Button>
              </Link>
            </div>

            <div className="flex gap-2 justify-center pt-8">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Categories Carousel Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Shop by Category
              </h3>
              <p className="text-muted-foreground mt-2">Discover what your campus is selling</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCategories('left')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-primary flex items-center justify-center transition-all hover:shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCategories('right')}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-primary flex items-center justify-center transition-all hover:shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={categoryScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <Link key={index} href={`/products?category=${category.name}`}>
                <Card className="min-w-[240px] sm:min-w-[260px] md:min-w-[280px] h-[320px] sm:h-[350px] md:h-[380px] relative overflow-hidden hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-white">
                  {/* Background Image or Gradient */}
                  {category.image ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-50 transition-opacity`} />
                    </>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                  )}

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                  {/* Content */}
                  <CardContent className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 md:p-6 text-white">
                    <div>
                      <h4 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{category.name}</h4>
                      <p className="text-sm sm:text-base text-white/90 drop-shadow-md font-medium">{category.count} items available</p>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 w-fit group-hover:bg-white/30 transition-colors">
                      Explore {category.name}
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Listed Products - Grid View like Flipkart */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900">
                  All Listed Products
                </h3>
              </div>
              <p className="text-gray-600 ml-[52px]">Browse all items available on the marketplace</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {recentProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white border border-gray-100 hover:border-blue-200 rounded-xl overflow-hidden h-full">
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-md hover:shadow-lg z-10">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-sm">
                        {product.title}
                      </h4>
                      <div className="flex items-baseline gap-1 mb-2">
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(product.priceCents)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="capitalize text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {product.condition}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No listings yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to list an item!</p>
              <Link href="/post">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  List an Item
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section - Redesigned with Human Touch */}
      <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header with natural alignment */}
          <div className="mb-16 max-w-2xl">
            <h3 className="text-5xl md:text-6xl font-bold mb-5 text-gray-900 leading-tight">
              Why students trust us
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Built by students, for students. We get what you need.
            </p>
          </div>

          {/* Asymmetric grid layout - more organic */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* First card - slightly larger */}
            <div className="lg:col-span-1 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Students only</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Verified university emails keep our community safe and trustworthy.
                  </p>
                </div>
              </div>
            </div>

            {/* Second card - standard size */}
            <div className="lg:col-span-1 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 group">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Secure payments</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Razorpay integration with admin oversight for every transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Third card - spans full width on md, then normal */}
            <div className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100 hover:border-purple-200 group">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Quick & easy</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    List items in seconds. Find what you need instantly. Track orders in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional trust indicators - subtle and human */}
          <div className="mt-10 sm:mt-12 md:mt-16 pt-8 sm:pt-10 md:pt-12 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>100% student verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Secure transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced CTA */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <CardContent className="pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-16 md:pb-16 px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              {user ? (
                <>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Ready to sell something?
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 text-gray-300 px-2">
                    List your items and start earning money from your unused belongings
                  </p>
                  <Link href="/post">
                    <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 h-auto group w-full sm:w-auto">
                      Create New Listing
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Ready to get started?
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 text-gray-300 px-2">
                    Join thousands of students buying and selling on campus
                  </p>
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 h-auto group w-full sm:w-auto">
                      Create Free Account
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
