'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminTable, { Column } from '@/components/AdminTable';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/lib/api';
import { Report } from '@/lib/types';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AdminService.getAllReports();
            setReports(response.data.reports);
        } catch (err: any) {
            console.error('Failed to load reports:', err);
            setError(err.response?.data?.error || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const columns: Column<Report>[] = [
        { header: 'Product', accessorKey: (r) => r.product?.title || 'Unknown', className: 'font-medium' },
        { header: 'Reported By', accessorKey: (r) => r.reporter?.name || 'Unknown' },
        { header: 'Reason', accessorKey: 'reason' },
        {
            header: 'Status',
            accessorKey: (r) => (
                <Badge variant={r.status === 'resolved' ? 'secondary' : 'destructive'}>
                    {r.status}
                </Badge>
            )
        },
        { header: 'Date', accessorKey: (r) => new Date(r.createdAt).toLocaleDateString() },
    ];

    const handleResolve = async (report: Report) => {
        if (confirm("Mark this report as resolved?")) {
            try {
                await AdminService.resolveReport(report.id, 'approve');
                // Reload reports after successful resolution
                await loadReports();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Failed to resolve report');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reports Handling</h1>
                    <p className="text-gray-500 mt-1">Review user reports and content issues</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
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
