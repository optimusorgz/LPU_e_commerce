'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    Share2,
    Flag,
    ShieldCheck,
    MapPin,
    Clock,
    ArrowLeft,
    School,
    Shield,
    Package
} from 'lucide-react';
import { ProductService } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const response = await ProductService.getOne(id);
                setProduct(response.data.product);
            } catch (err: any) {
                console.error('Failed to load product:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const formatPrice = (priceCents: number) => {
        return `₹${(priceCents / 100).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) {
            return 'Recently';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading product details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                        <p className="text-gray-500 mb-6">{error || "The item you're looking for might have been removed or sold."}</p>
                        <Link href="/products">
                            <Button variant="default" className="w-full">Browse Products</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-6">
                    <Link
                        href="/products"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-24">
                            <ProductGallery images={product.images || []} title={product.title} />

                            {/* Product Description (Desktop position) */}
                            <div className="hidden lg:block mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    <p>{product.description || 'No description provided.'}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Listed</p>
                                        <div className="flex items-center text-gray-900 font-medium">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            {formatDate(product.createdAt)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Location</p>
                                        <div className="flex items-center text-gray-900 font-medium">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {product.location || 'Campus'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Info & Actions */}
                    <div className="lg:col-span-5">
                        <div className="flex flex-col gap-6">
                            {/* Title & Price Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    {product.category && (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            {product.category}
                                        </Badge>
                                    )}
                                    <div className="flex gap-2 ml-auto">
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 text-gray-500">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product.title}
                                </h1>

                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">{formatPrice(product.priceCents)}</p>
                                        <p className="text-sm text-gray-500 mt-1">Non-negotiable</p>
                                    </div>
                                    {product.condition && (
                                        <Badge variant="outline" className="px-3 py-1 border-gray-200">
                                            Condition: <span className="font-semibold text-gray-900 ml-1 capitalize">{product.condition}</span>
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-200 transition-all transform hover:scale-[1.02]">
                                        Buy Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`w-full h-12 text-lg font-medium border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-700'}`}
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                    >
                                        <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                                        {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                                    </Button>
                                </div>
                            </div>

                            {/* Seller Card */}
                            {product.user && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Seller Information</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        {product.user.avatarUrl ? (
                                            <img
                                                src={product.user.avatarUrl}
                                                alt={product.user.name}
                                                className="w-14 h-14 rounded-full object-cover border border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
                                                {product.user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-gray-900">{product.user.name}</h4>
                                                {product.user.universityId && (
                                                    <ShieldCheck className="w-4 h-4 text-green-500" aria-label="Verified Student" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <School className="w-3 h-3" />
                                                {/* Backend doesn't return user join date yet, so we omit that detail or use joined recently */}
                                                <span>Student Seller</span>
                                            </div>
                                        </div>
                                    </div>

                                    {product.user.universityId && (
                                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                            <div className="flex gap-3">
                                                <ShieldCheck className="w-5 h-5 text-blue-600 flex-none" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900">Verified University Student</p>
                                                    <p className="text-xs text-blue-700 mt-1">This seller has verified their university email address.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Safety Tips */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Safety Tips
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                    <li>Meet in safe, public campus locations.</li>
                                    <li>Check the item properly before buying.</li>
                                    <li>Payments are held securely until you confirm receipt.</li>
                                </ul>
                            </div>

                            {/* Report Button */}
                            <button className="w-full py-4 text-center text-sm text-gray-400 hover:text-red-600 font-medium transition-colors flex items-center justify-center gap-2">
                                <Flag className="w-4 h-4" />
                                Report this listing
                            </button>
                        </div>
                    </div>

                    {/* Mobile Description (Visible only on mobile) */}
                    <div className="lg:hidden col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                            <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                                <p>{product.description || 'No description provided.'}</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Listed</p>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        {formatDate(product.createdAt)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                        {product.location || 'Campus'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
