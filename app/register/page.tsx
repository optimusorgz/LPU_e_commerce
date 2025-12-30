'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Eye, EyeOff, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/lib/api';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        universityId: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password length
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        // Validate Gmail address
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(formData.email)) {
            setError('Please use a valid Gmail address (example@gmail.com)');
            return;
        }

        setLoading(true);

        try {
            // 1. Sign up with Supabase
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        universityId: formData.universityId,
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (authData.session) {
                // 2. Sync user to backend
                // The /auth/sync endpoint will expect a valid Supabase token
                // We use the token from the signup response
                try {
                    await AuthService.syncUser({
                        name: formData.name,
                        email: formData.email,
                        universityId: formData.universityId,
                    }, authData.session.access_token);

                    // Store auth data locally
                    localStorage.setItem('token', authData.session.access_token);
                    localStorage.setItem('user', JSON.stringify({
                        ...authData.user,
                        isAdmin: false // Default new users to non-admin
                    }));

                    // Refresh user context to update header/footer immediately
                    await refreshUser();

                    router.push('/');
                } catch (syncError: unknown) {
                    // Start rollback if sync fails (optional but good practice)
                    console.error('Sync failed:', syncError);
                    throw new Error('Account created but failed to sync profile. Please contact support.');
                }
            } else {
                // Determine if email confirmation is enabled on Supabase project
                setError('Please check your email to confirm your account.');
                setLoading(false); // Stop loading if waiting for confirmation
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
            setError(message);
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
                <div className="w-full flex rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl min-h-[600px] transform-3d preserve-3d floating-card bg-white flex-row-reverse">
                    {/* Right Side - Marketing/Branding */}
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
                                        <span className="text-sm font-medium tracking-wide">JOIN US</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                        Start selling and buying on campus today
                                    </h1>
                                    <p className="text-lg text-white/90 leading-relaxed max-w-md">
                                        Create your account and join thousands of students. Safe, simple, and secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Side - Register Form */}
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
                                    Create an account
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Join with your Gmail account
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
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 form-group">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Gmail Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Please use your Gmail address
                                    </p>
                                </div>

                                <div className="space-y-2 form-group">
                                    <label htmlFor="universityId" className="text-sm font-medium text-gray-700">
                                        Student ID <span className="text-gray-400 font-normal">(Optional)</span>
                                    </label>
                                    <Input
                                        id="universityId"
                                        name="universityId"
                                        placeholder="12345678"
                                        value={formData.universityId}
                                        onChange={handleChange}
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
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                    <p className="text-xs text-gray-500">
                                        Min. 8 characters
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 !bg-black hover:!bg-gray-900 !text-white font-medium rounded-lg transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2 text-white">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Create Account
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-gray-600 pt-4">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                        Sign in
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
