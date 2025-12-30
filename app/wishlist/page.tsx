'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />

            <div className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Start exploring products to add them here!</p>
                        <Link href="/products">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Search className="w-4 h-4 mr-2" />
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <div key={product.id} className="relative group">
                                <ProductCard product={product} />
                                <button
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Handle remove
                                        setWishlist(items => items.filter(i => i.id !== product.id));
                                    }}
                                    title="Remove from wishlist"
                                >
                                    <Heart className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
