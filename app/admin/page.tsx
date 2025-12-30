'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingReports: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock API fetch
        const loadStats = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setStats({
                totalUsers: 1250,
                totalProducts: 450,
                totalOrders: 89,
                pendingReports: 5,
                totalRevenue: 450000 // In cents
            });
            setLoading(false);
        };
        loadStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', link: '/admin/users' },
        { title: 'Active Listings', value: stats.totalProducts, icon: Package, color: 'text-purple-600', link: '/admin/products' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-green-600', link: '/admin/orders' },
        { title: 'Pending Reports', value: stats.pendingReports, icon: AlertTriangle, color: 'text-red-500', link: '/admin/reports' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of marketplace activity</p>
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

                {/* Revenue Card (Full Width) */}
                <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Total Platform Revenue</p>
                                <h2 className="text-4xl font-bold">
                                    ₹{(stats.totalRevenue / 100).toLocaleString()}
                                </h2>
                            </div>
                            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
