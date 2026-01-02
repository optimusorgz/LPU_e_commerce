'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/lib/api';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AdminService.getAllProducts();
            setProducts(response.data.products);
        } catch (err: any) {
            console.error('Failed to load products:', err);
            setError(err.response?.data?.error || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const columns: Column<Product>[] = [
        { header: 'Title', accessorKey: 'title', className: 'font-medium' },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Price', accessorKey: (p) => `₹${(p.priceCents / 100).toFixed(2)}` },
        { header: 'Seller', accessorKey: (p) => p.user?.name || 'Unknown' },
        {
            header: 'Status',
            accessorKey: (p) => (
                <Badge variant={p.status === 'available' ? 'outline' : p.status === 'sold' ? 'secondary' : 'default'}>
                    {p.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: (p) => new Date(p.createdAt).toLocaleDateString() },
    ];

    const handleDelete = async (product: Product) => {
        if (confirm(`Delete listing "${product.title}"?`)) {
            try {
                await AdminService.deleteProduct(product.id);
                // Reload products after successful delete
                await loadProducts();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Failed to delete product');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Product Moderation</h1>
                    <p className="text-gray-500 mt-1">Review and manage listings</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <AdminTable
                    data={products}
                    columns={columns}
                    isLoading={loading}
                    onDelete={handleDelete}
                    onView={(item) => window.location.href = `/products/${item.id}`}
                />
            </main>
            <Footer />
        </div>
    );
}
