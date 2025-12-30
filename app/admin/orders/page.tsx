'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: string;
    buyer: string;
    total: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    date: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const loadOrders = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setOrders([
                { id: 'ord_123', buyer: 'Kaushik Ranjan', total: 850, status: 'confirmed', date: '2023-11-20' },
                { id: 'ord_456', buyer: 'Student Two', total: 1200, status: 'pending', date: '2023-11-21' },
            ]);
            setLoading(false);
        };
        loadOrders();
    }, []);

    const columns: Column<Order>[] = [
        { header: 'Order ID', accessorKey: 'id', className: 'font-medium' },
        { header: 'Buyer', accessorKey: 'buyer' },
        { header: 'Total', accessorKey: (o) => `₹${o.total}` },
        {
            header: 'Status',
            accessorKey: (o) => (
                <Badge variant="outline" className={`capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                    }`}>
                    {o.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: 'date' },
    ];

    const handleApprove = (order: Order) => {
        if (order.status === 'pending') {
            if (confirm("Confirm this order?")) {
                setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'confirmed' } : o));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-500 mt-1">Track and manage marketplace orders</p>
                </div>

                <AdminTable
                    data={orders}
                    columns={columns}
                    isLoading={loading}
                    onApprove={handleApprove}
                    onView={(item) => alert(`View order details for ${item.id}`)}
                />
            </main>
            <Footer />
        </div>
    );
}
