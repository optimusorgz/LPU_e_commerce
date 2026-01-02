'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AdminService } from '@/lib/api';
import { AdminStats } from '@/lib/types';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingProducts: 0,
        paidOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await AdminService.getStats();
                setStats(response.data.stats);
            } catch (err: any) {
                console.error('Failed to load admin stats:', err);
                setError(err.response?.data?.error || 'Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', link: '/admin/users' },
        { title: 'Active Listings', value: stats.totalProducts, icon: Package, color: 'text-purple-600', link: '/admin/products' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-green-600', link: '/admin/orders' },
        { title: 'Pending Products', value: stats.pendingProducts, icon: AlertTriangle, color: 'text-red-500', link: '/admin/products' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of marketplace activity</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <Link key={idx} href={card.link}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">
                                            {card.title}
                                        </CardTitle>
                                        <Icon className={`h-4 w-4 ${card.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        {loading ? (
                                            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
                                        ) : (
                                            <div className="text-2xl font-bold">{card.value}</div>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                            Manage <ArrowRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Recent Activity (Optional placeholder) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 py-8 text-center">No recent orders to display.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Signups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 py-8 text-center">No recent signups to display.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
