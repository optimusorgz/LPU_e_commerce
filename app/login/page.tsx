'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Eye, EyeOff, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Store auth data
            if (data.session) {
                // We're moving away from manual token management, but for backward compatibility/backend usage:
                localStorage.setItem('token', data.session.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Refresh user context to update header/footer immediately
                await refreshUser();
            }

            // Redirect to previous page or home (not dashboard)
            const returnUrl = localStorage.getItem('returnUrl') || '/';
            localStorage.removeItem('returnUrl'); // Clean up

            // Basic check for admin (this logic might need refinement based on how roles are stored in metadata in Supabase)
            // For now, assuming standard user redirect
            router.push(returnUrl);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* 3D Floating Card Container */}
            <div className="relative w-full max-w-6xl perspective-1000">
                <div className="w-full flex rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl min-h-[600px] transform-3d preserve-3d floating-card bg-white">
                    {/* Left Side - Marketing/Branding */}
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-spin-slow" />

                        <div className="relative z-10 flex flex-col h-full p-10 lg:p-12 text-white w-full">
                            <div className="flex-none">
                                <div className="flex items-center gap-2 transform hover:scale-105 transition-transform origin-left">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold">Campus Market</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center max-w-lg">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <ArrowRight className="w-4 h-4 animate-bounce-x" />
                                        <span className="text-sm font-medium tracking-wide">WELCOME BACK</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                        Ready to upgrade your campus shopping?
                                    </h1>
                                    <p className="text-lg text-white/90 leading-relaxed max-w-md">
                                        Join thousands of students buying and selling on campus. Safe, simple, and secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right Side - Login Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-md mx-auto">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex items-center gap-2 mb-8">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Store className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-gray-900">Campus Market</span>
                            </div>

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Log in to your account
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm animate-shake">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2 form-group">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Id
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 form-group">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all" />
                                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                                    </label>
                                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 !bg-black hover:!bg-gray-900 !text-white font-medium rounded-lg transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2 text-white">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Logging in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Log in
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-gray-600 pt-4">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                        Sign up
                                    </Link>
                                </div>
                            </form>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors">
                                    ← Back to home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
