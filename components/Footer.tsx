import Link from 'next/link';
import { Github, Twitter, Mail, Heart, Store } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { user } = useAuth();

    return (
        <footer className="relative mt-12 sm:mt-16 md:mt-20 border-t bg-gradient-to-b from-white to-gray-50">
            {/* Main Footer */}
            <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-lg">Campus Market</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The trusted marketplace for students to buy and sell on campus.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Marketplace</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Browse Products
                                </Link>
                            </li>
                            <li>
                                <Link href={user ? "/post" : "/register"} className="text-muted-foreground hover:text-foreground transition-colors">
                                    {user ? "Sell Items" : "Start Selling"}
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=Electronics" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=Books" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Textbooks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="font-semibold mb-4">Account</h4>
                        <ul className="space-y-2 text-sm">
                            {user ? (
                                <>
                                    <li>
                                        <Link href="/my-account" className="text-muted-foreground hover:text-foreground transition-colors">
                                            My Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/my-products" className="text-muted-foreground hover:text-foreground transition-colors">
                                            My Listings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Wishlist
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Create Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Browse Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Wishlist
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Safety Guidelines
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Report Issue
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            © {currentYear} Campus Marketplace. Made with{' '}
                            <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for students
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
