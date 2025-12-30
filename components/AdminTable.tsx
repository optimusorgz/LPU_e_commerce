'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye, Ban, CheckCircle } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    onApprove?: (item: T) => void;
    onReject?: (item: T) => void;
    isLoading?: boolean;
}

export default function AdminTable<T extends { id: string | number }>({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    onApprove,
    onReject,
    isLoading
}: AdminTableProps<T>) {

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 bg-gray-50 rounded-md animate-pulse" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No records found.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        {columns.map((col, idx) => (
                            <TableHead key={idx} className={col.className}>{col.header}</TableHead>
                        ))}
                        {(onEdit || onDelete || onView || onApprove) && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            {columns.map((col, idx) => (
                                <TableCell key={idx} className={col.className}>
                                    {typeof col.accessorKey === 'function'
                                        ? col.accessorKey(item)
                                        : (item[col.accessorKey] as React.ReactNode)}
                                </TableCell>
                            ))}
                            {(onEdit || onDelete || onView || onApprove || onReject) && (
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {onView && (
                                            <Button variant="ghost" size="icon" onClick={() => onView(item)}>
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </Button>
                                        )}
                                        {onApprove && (
                                            <Button variant="ghost" size="icon" onClick={() => onApprove(item)} className="hover:text-green-600 hover:bg-green-50">
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {onReject && (
                                            <Button variant="ghost" size="icon" onClick={() => onReject(item)} className="hover:text-red-600 hover:bg-red-50">
                                                <Ban className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {onEdit && (
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                                                <Edit2 className="w-4 h-4 text-blue-600" />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
