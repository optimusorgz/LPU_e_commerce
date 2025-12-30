'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, ArrowLeft, Package, User, CheckCircle, Clock, Truck, XCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        location?: string;
        condition?: string;
    };
    seller?: {
        name: string;
        email: string;
    };
    buyer?: {
        name: string;
        email: string;
    };
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && id) {
            fetchOrder();
        }
    }, [user, authLoading, id, router]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            } else {
                router.push('/orders');
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'confirmed': return <Truck className="w-5 h-5 text-blue-600" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20 max-w-4xl">
                <Link href="/orders" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            Order #{order.id.slice(0, 8)}
                        </h1>
                        <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} px-4 py-1.5 text-sm font-medium border flex items-center gap-2 w-fit`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Product Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    Item Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{order.product?.title}</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-medium">Price:</span> ₹{(order.totalAmount / 100).toLocaleString()}</p>
                                            {order.product?.condition && (
                                                <p><span className="font-medium">Condition:</span> <span className="capitalize">{order.product.condition}</span></p>
                                            )}
                                            {order.product?.location && (
                                                <p className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {order.product.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline (Mock for now, could be real if backend supports history) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    Order Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative pl-8 border-l-2 border-gray-100 ml-6 py-2 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[41px] bg-green-500 h-5 w-5 rounded-full border-4 border-white" />
                                    <p className="font-medium text-gray-900">Order Placed</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                                {/* Add more steps based on status if available */}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Seller/Buyer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="w-5 h-5 text-gray-500" />
                                    {order.seller?.email === user?.email ? 'Buyer Details' : 'Seller Details'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.seller?.email === user?.email ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{order.buyer?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{order.buyer?.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{order.seller?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{order.seller?.email}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{(order.totalAmount / 100).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{(order.totalAmount / 100).toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
