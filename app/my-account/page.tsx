'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, ShoppingBag, Heart, Camera, Star, Lightbulb, Shield, Edit, Calendar } from 'lucide-react';
import { User as UserType } from '@/lib/types';

export default function MyAccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        wishlist: 0
    });

    useEffect(() => {
        fetchUserData();
    }, [router]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            // Fetch user profile
            const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers });
            if (!userRes.ok) throw new Error('Failed to fetch user');
            const userData = await userRes.json();
            setUser(userData.user);
            setEditForm({
                name: userData.user.name || '',
                bio: userData.user.bio || '',
            });

            // Fetch stats in parallel
            const [productsRes, ordersRes, wishlistRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/me`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, { headers })
            ]);

            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();
            const wishlistData = await wishlistRes.json();

            setStats({
                products: productsData.products?.length || 0,
                orders: ordersData.orders?.length || 0,
                wishlist: wishlistData.wishlist?.length || 0
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            // Optionally redirect to login on auth error
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50">
                <Header />

                <div className="container mx-auto px-4 py-8 mt-20 max-w-6xl">
                    {/* Profile Header Skeleton */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar Skeleton */}
                            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />

                            {/* Info Skeleton */}
                            <div className="flex-1 space-y-3 w-full">
                                <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-32" />
                                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-48" />
                                <div className="h-12 bg-gray-200 animate-pulse rounded-lg w-full" />
                                <div className="flex gap-4">
                                    <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-32" />
                                    <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-40" />
                                </div>
                            </div>

                            {/* Actions Skeleton */}
                            <div className="flex flex-col gap-3 min-w-[140px] w-full md:w-auto">
                                <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
                                <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Account Overview Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-20 mb-3" />
                                <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-12" />
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions Skeleton */}
                    <div className="mb-8">
                        <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-32 mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-8 mb-3" />
                                    <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-20 mb-2" />
                                    <div className="h-3 bg-gray-200 animate-pulse rounded-lg w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    if (!user) return null;

    const quickActions = [
        { title: 'Post Item', Icon: Camera, description: 'List your item for sale', href: '/post', gradient: 'from-blue-500 to-cyan-500' },
        { title: 'My Listings', Icon: Package, description: 'Manage your products', href: '/my-products', gradient: 'from-purple-500 to-pink-500' },
        { title: 'My Orders', Icon: ShoppingBag, description: 'View your purchases', href: '/orders', gradient: 'from-orange-500 to-red-500' },
        { title: 'Wishlist', Icon: Star, description: 'Saved items', href: '/wishlist', gradient: 'from-green-500 to-teal-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
            <Header />

            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-16 sm:mt-20 max-w-7xl pb-12">
                {/* Top Right Info Section */}
                <div className="flex justify-end mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 md:p-5 w-full sm:max-w-sm">
                        <div className="flex items-start gap-2 sm:gap-3">
                            {/* Profile Avatar */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-md">
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{user.name}</h2>
                                <p className="text-gray-500 text-xs sm:text-xs mb-2 sm:mb-3 truncate">{user.email}</p>
                                
                                <div className="space-y-1 sm:space-y-2">
                                    <div className="flex items-center gap-1 sm:gap-1.5 text-gray-600 text-xs">
                                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 flex-shrink-0" />
                                        <span className="truncate">Joined {new Date(user.createdAt || Date.now()).getFullYear()}</span>
                                    </div>
                                    {user.isAdmin ? (
                                        <div className="flex items-center gap-1 sm:gap-1.5 text-orange-600 font-medium text-xs">
                                            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                            <span>Admin</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 sm:gap-1.5 text-green-600 font-medium text-xs">
                                            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                            <span>Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pencil Edit Button */}
                            <Link href="/edit-profile" className="flex-shrink-0">
                                <Button variant="ghost" size="sm" className="w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Account Stats - Improved */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-50" onClick={() => router.push('/my-products')}>
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col items-start gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Products</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.products}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-green-50 to-green-50 hover:from-green-100 hover:to-green-50" onClick={() => router.push('/orders')}>
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col items-start gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Orders</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.orders}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-red-50 to-red-50 hover:from-red-100 hover:to-red-50" onClick={() => router.push('/wishlist')}>
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col items-start gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 fill-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Wishlist</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.wishlist}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions - Mobile Optimized */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group border border-gray-100 hover:border-gray-200">
                                    <CardContent className="p-3 sm:p-5 flex flex-col items-center text-center h-full justify-center">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                            <action.Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">{action.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">{action.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Info Cards - Better Mobile Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="border-0 bg-gradient-to-br from-amber-50/80 to-orange-50/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                                <div className="p-2 bg-amber-200/50 rounded-lg">
                                    <Lightbulb className="w-5 h-5 text-amber-600" />
                                </div>
                                Seller Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3">
                            <p className="text-xs sm:text-sm text-amber-800/90 flex items-start gap-2">
                                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                                <span>Take clear, well-lit photos of your items</span>
                            </p>
                            <p className="text-xs sm:text-sm text-amber-800/90 flex items-start gap-2">
                                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                                <span>Write detailed descriptions mentioning defects</span>
                            </p>
                            <p className="text-xs sm:text-sm text-amber-800/90 flex items-start gap-2">
                                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                                <span>Meet buyers in safe, public campus areas</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                                <div className="p-2 bg-blue-200/50 rounded-lg">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                Security Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3">
                            <p className="text-xs sm:text-sm text-blue-800/90 flex items-start gap-2">
                                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                                <span>Only communicate through our platform</span>
                            </p>
                            <p className="text-xs sm:text-sm text-blue-800/90 flex items-start gap-2">
                                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                                <span>Verify item condition in person before paying</span>
                            </p>
                            <p className="text-xs sm:text-sm text-blue-800/90 flex items-start gap-2">
                                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                                <span>Report any suspicious behavior immediately</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
}
