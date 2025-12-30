'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'blocked';
    joinedAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const loadUsers = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setUsers([
                { id: 'u1', name: 'Kaushik Ranjan', email: 'kaushik@university.edu', role: 'admin', status: 'active', joinedAt: '2023-08-15' },
                { id: 'u2', name: 'Student One', email: 's1@university.edu', role: 'user', status: 'active', joinedAt: '2023-09-01' },
                { id: 'u3', name: 'Student Two', email: 's2@university.edu', role: 'user', status: 'blocked', joinedAt: '2023-09-05' },
            ]);
            setLoading(false);
        };
        loadUsers();
    }, []);

    const columns: Column<User>[] = [
        { header: 'Name', accessorKey: 'name', className: 'font-medium' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Role',
            accessorKey: (user) => (
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                </Badge>
            )
        },
        {
            header: 'Status',
            accessorKey: (user) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {user.status}
                </span>
            )
        },
        { header: 'Joined', accessorKey: 'joinedAt' },
    ];

    const handleBlock = (user: User) => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        if (confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} ${user.name}?`)) {
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">View and manage platform users</p>
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
