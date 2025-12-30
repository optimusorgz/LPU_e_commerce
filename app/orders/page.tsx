'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Order {
    id: string;
    status: 'placed' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    createdAt: string;
    product?: {
        id: string;
        title: string;
        priceCents: number;
        images?: string[];
    };
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20 max-w-5xl">
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

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        My Orders
                    </h1>
                    <p className="text-gray-600 mt-1">Track and manage your purchases</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">You haven&apos;t purchased anything yet.</p>
                        <Link href="/products">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            {order.product?.images?.[0] ? (
                                                <img
                                                    src={order.product.images[0]}
                                                    alt={order.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Order #{order.id.slice(0, 8)} • {formatDate(order.createdAt)}
                                                    </p>
                                                    <h3 className="font-semibold text-lg text-gray-900 truncate pr-4">
                                                        {order.product?.title || 'Unknown Product'}
                                                    </h3>
                                                </div>
                                                <Badge className={`${getStatusColor(order.status)} border-0`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mt-4">
                                                <p className="font-bold text-lg">
                                                    ₹{(order.totalAmount / 100).toLocaleString()}
                                                </p>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
