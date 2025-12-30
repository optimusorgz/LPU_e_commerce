'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Package, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductService } from '@/lib/api';

export default function MyProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { data } = await ProductService.getMine();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to load my products', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            try {
                await ProductService.delete(id);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Failed to delete product');
            }
        }
    };

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
                            <Package className="w-8 h-8 text-blue-600" />
                            My Listings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your active products
                        </p>
                    </div>
                    <Link href="/post">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            List New Item
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No active listings</h2>
                        <p className="text-gray-500 mb-6">You haven't listed anything for sale yet.</p>
                        <Link href="/post">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Start Selling
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="relative group block">
                                <ProductCard product={product} />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                    <Link href={`/edit/${product.id}`}>
                                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white hover:bg-white/90">
                                            <Edit2 className="w-4 h-4 text-gray-900" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-10 w-10 rounded-full"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
