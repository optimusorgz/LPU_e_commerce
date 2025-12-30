'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';

interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
    seller: string;
    status: 'active' | 'sold';
    date: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const loadProducts = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setProducts([
                { id: 'p1', title: 'Calculus Textbook', category: 'Books', price: 450, seller: 'Student One', status: 'active', date: '2023-11-20' },
                { id: 'p2', title: 'Study Table', category: 'Furniture', price: 1200, seller: 'Student Two', status: 'sold', date: '2023-11-18' },
            ]);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const columns: Column<Product>[] = [
        { header: 'Title', accessorKey: 'title', className: 'font-medium' },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Price', accessorKey: (p) => `₹${p.price}` },
        { header: 'Seller', accessorKey: 'seller' },
        {
            header: 'Status',
            accessorKey: (p) => (
                <Badge variant={p.status === 'active' ? 'outline' : 'secondary'}>
                    {p.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: 'date' },
    ];

    const handleDelete = (product: Product) => {
        if (confirm(`Delete listing "${product.title}"?`)) {
            setProducts(products.filter(p => p.id !== product.id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Product Moderation</h1>
                    <p className="text-gray-500 mt-1">Review and manage listings</p>
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
