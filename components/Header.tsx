'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, Heart, Package, Shield, Store, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
    transparent?: boolean;
}

function ProfileMenu({ user, logout, isAdmin }: { user: any; logout: () => void; isAdmin?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition transform hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name || 'Profile'} className="w-9 h-9 object-cover rounded-full" />
                ) : (
                    <div className="w-9 h-9 bg-gray-100 text-gray-700 flex items-center justify-center rounded-full">
                        <User className="w-4 h-4" />
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                    <Link href="/my-account" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Account
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50">
                            Admin
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Header({ transparent = false }: HeaderProps) {
    const { user, logout, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Handle scroll for glass effect
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = transparent
        ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isSidebarOpen
            ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm'
            : 'bg-transparent'
        }`
        : 'border-b bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50';

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 md:py-6 relative z-50">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg transition-transform group-hover:scale-110 flex items-center justify-center">
                            <Store className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Campus Market
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link href="/products">
                            <Button variant="ghost" className="gap-2 transform transition-transform duration-200 hover:scale-110">
                                <ShoppingBag className="w-4 h-4" />
                                Browse
                            </Button>
                        </Link>

                        {loading ? (
                            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-md" />
                        ) : user ? (
                            <>
                                <Link href="/post">
                                    <Button variant="ghost" className="gap-2 transform transition-transform duration-200 hover:scale-110">
                                        <Package className="w-4 h-4" />
                                        Sell
                                    </Button>
                                </Link>
                                <Link href="/wishlist">
                                    <Button variant="ghost" className="gap-2 transform transition-transform duration-200 hover:scale-110">
                                        <Heart className="w-4 h-4" />
                                        Wishlist
                                    </Button>
                                </Link>
                                <ProfileMenu user={user} logout={logout} isAdmin={user.isAdmin} />
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="transform transition-transform duration-200 hover:scale-110">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transform transition-transform duration-200 hover:scale-110">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile/Tablet Menu Button */}
                    <div className="lg:hidden">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen} modal={false}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    {isSidebarOpen ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="bg-white/80 backdrop-blur-lg border-l pt-3 sm:pt-4 top-[69px] sm:top-[77px] md:top-[85px] h-[calc(100vh-69px)] sm:h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] shadow-none [&>button]:hidden"
                                onInteractOutside={(e) => e.preventDefault()}
                            >
                                <SheetHeader className="hidden">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4">
                                    <Link href="/products" onClick={() => setIsSidebarOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start gap-2 transform transition-transform duration-200 hover:scale-105">
                                            <ShoppingBag className="w-4 h-4" />
                                            Browse
                                        </Button>
                                    </Link>

                                    {loading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md" />
                                            ))}
                                        </div>
                                    ) : user ? (
                                        <>
                                            <Link href="/post" onClick={() => setIsSidebarOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start gap-2 transform transition-transform duration-200 hover:scale-105">
                                                    <Package className="w-4 h-4" />
                                                    Sell
                                                </Button>
                                            </Link>
                                            <Link href="/wishlist" onClick={() => setIsSidebarOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start gap-2 transform transition-transform duration-200 hover:scale-105">
                                                    <Heart className="w-4 h-4" />
                                                    Wishlist
                                                </Button>
                                            </Link>
                                            <Link href="/my-account" onClick={() => setIsSidebarOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start gap-2 transform transition-transform duration-200 hover:scale-105">
                                                    <User className="w-4 h-4" />
                                                    My Account
                                                </Button>
                                            </Link>
                                            {user.isAdmin && (
                                                <Link href="/admin" onClick={() => setIsSidebarOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start gap-2 text-orange-600 hover:text-orange-700 transform transition-transform duration-200 hover:scale-105">
                                                        <Shield className="w-4 h-4" />
                                                        Admin
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button variant="ghost" className="w-full justify-start gap-2 hover:text-destructive transform transition-transform duration-200 hover:scale-105" onClick={() => {
                                                setIsSidebarOpen(false);
                                                logout();
                                            }}>
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <Link href="/login" onClick={() => setIsSidebarOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start transform transition-transform duration-200 hover:scale-105">Login</Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setIsSidebarOpen(false)}>
                                                <Button className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transform transition-transform duration-200 hover:scale-105">
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
