'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    universityId?: string;
    isAdmin: boolean;
    avatarUrl?: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => { },
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                // Token invalid
                logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await fetchUser(token);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }

        // Listen for storage changes (login/logout from other tabs or direct token updates)
        const handleStorageChange = async (e: StorageEvent) => {
            if (e.key === 'token') {
                if (e.newValue) {
                    // Token was added/updated - fetch user
                    setLoading(true);
                    await fetchUser(e.newValue);
                } else {
                    // Token was removed - logout
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Handle redirects
    useEffect(() => {
        if (!loading) {
            const isAuthPage = pathname === '/login' || pathname === '/register';

            if (user && isAuthPage) {
                // If logged in and on auth page, redirect to home
                router.push('/');
            }
        }
    }, [user, loading, pathname]);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
