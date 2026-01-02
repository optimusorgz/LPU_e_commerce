'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/lib/api';
import { Order } from '@/lib/types';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AdminService.getAllOrders();
            setOrders(response.data.orders);
        } catch (err: any) {
            console.error('Failed to load orders:', err);
            setError(err.response?.data?.error || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const columns: Column<Order>[] = [
        { header: 'Order ID', accessorKey: 'id', className: 'font-medium' },
        { header: 'Buyer', accessorKey: (o) => o.buyer?.name || 'Unknown' },
        { header: 'Total', accessorKey: (o) => `₹${(o.totalAmount / 100).toFixed(2)}` },
        {
            header: 'Status',
            accessorKey: (o) => (
                <Badge variant="outline" className={`capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'placed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {o.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: (o) => new Date(o.createdAt).toLocaleDateString() },
    ];

    const handleApprove = async (order: Order) => {
        if (order.status === 'placed') {
            if (confirm("Confirm this order?")) {
                try {
                    await AdminService.updateOrderStatus(order.id, 'confirmed');
                    // Reload orders after successful update
                    await loadOrders();
                } catch (err: any) {
                    alert(err.response?.data?.error || 'Failed to update order status');
                }
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
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
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
