'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/lib/api';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AdminService.getAllUsers();
            setUsers(response.data.users);
        } catch (err: any) {
            console.error('Failed to load users:', err);
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const columns: Column<User>[] = [
        { header: 'Name', accessorKey: 'name', className: 'font-medium' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Role',
            accessorKey: (user) => (
                <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                    {user.isAdmin ? 'admin' : 'user'}
                </Badge>
            )
        },
        {
            header: 'Status',
            accessorKey: (user) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {user.isBlocked ? 'blocked' : 'active'}
                </span>
            )
        },
        { header: 'Joined', accessorKey: (u) => u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A' },
    ];

    const handleBlock = async (user: User) => {
        const newStatus = user.isBlocked ? 'active' : 'blocked';
        if (confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.name}?`)) {
            try {
                await AdminService.toggleUserBlock(user.id);
                // Reload users after successful toggle
                await loadUsers();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Failed to update user status');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">View and manage platform users</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <AdminTable
                    data={users}
                    columns={columns}
                    isLoading={loading}
                    onReject={handleBlock} // Using Reject icon for Block/Unblock for now
                />
            </main>
            <Footer />
        </div>
    );
}
