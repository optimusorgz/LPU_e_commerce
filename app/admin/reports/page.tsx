'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';

interface Report {
    id: string;
    productTitle: string;
    reportedBy: string;
    reason: string;
    status: 'pending' | 'resolved';
    date: string;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const loadReports = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setReports([
                { id: 'r1', productTitle: 'Inappropriate Book', reportedBy: 'Student A', reason: 'Spam listing', status: 'pending', date: '2023-11-20' },
                { id: 'r2', productTitle: 'Damaged Chair', reportedBy: 'Student B', reason: 'Misleading description', status: 'resolved', date: '2023-11-15' },
            ]);
            setLoading(false);
        };
        loadReports();
    }, []);

    const columns: Column<Report>[] = [
        { header: 'Product', accessorKey: 'productTitle', className: 'font-medium' },
        { header: 'Reported By', accessorKey: 'reportedBy' },
        { header: 'Reason', accessorKey: 'reason' },
        {
            header: 'Status',
            accessorKey: (r) => (
                <Badge variant={r.status === 'resolved' ? 'secondary' : 'destructive'}>
                    {r.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: 'date' },
    ];

    const handleResolve = (report: Report) => {
        if (confirm("Mark this report as resolved?")) {
            setReports(reports.map(r => r.id === report.id ? { ...r, status: 'resolved' } : r));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reports Handling</h1>
                    <p className="text-gray-500 mt-1">Review user reports and content issues</p>
                </div>

                <AdminTable
                    data={reports}
                    columns={columns}
                    isLoading={loading}
                    onApprove={handleResolve} // Using check circle to resolve
                    onView={(item) => alert(`View report details for ${item.id}`)}
                />
            </main>
            <Footer />
        </div>
    );
}
