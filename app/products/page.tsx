'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { Search, Filter } from 'lucide-react';
import { ProductService } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('q', search);
            if (category) params.append('category', category);

            const response = await ProductService.getAll(params.toString());
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (priceCents: number) => {
        return `₹${(priceCents / 100).toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />

            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-16 sm:mt-20">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-4">
                        Browse Products
                    </h2>
                    <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Discover items from your campus community</p>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <select
                                className="pl-10 pr-4 py-2 border rounded-md bg-white/50 backdrop-blur-sm border-gray-200 appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Books">Books</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Sports">Sports</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No products found</p>
                        <Link href="/post">
                            <Button className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700">
                                Post First Product
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
