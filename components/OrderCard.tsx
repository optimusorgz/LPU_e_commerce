'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrderItem {
    id: string;
    title: string;
    price: number;
    image: string;
}

interface Order {
    id: string;
    date: string;
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items: OrderItem[];
}

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const steps = [
        { status: 'Pending', icon: Clock, label: 'Ordered' },
        { status: 'Confirmed', icon: CheckCircle, label: 'Confirmed' },
        { status: 'Delivered', icon: Package, label: 'Delivered' }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1
        ? steps.findIndex(s => s.status === order.status)
        : order.status === 'Shipped' ? 1
            : 0;
    // Simply mapping for demo. 'Shipped' maps to after Confirmed.

    const statusColor = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
        'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
        'Delivered': 'bg-green-100 text-green-800 border-green-200',
        'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                            <Badge variant="outline" className={cn("capitalize border", statusColor[order.status])}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                            <Link href={`/orders/${order.id}`}>
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {/* Progress Bar (Simulated) */}
                {order.status !== 'Cancelled' && (
                    <div className="mb-8 relative max-w-2xl mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
                        />
                        <div className="relative flex justify-between">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;

                                return (
                                    <div key={step.status} className="flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                                            isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-300"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            isCompleted ? "text-blue-600" : "text-gray-400"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Items List */}
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-2">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                                <p className="text-sm text-gray-500">Qty: 1</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Total & Action */}
                <div className="mt-6 flex flex-col gap-3 sm:hidden pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Total</span>
                        <span className="text-xl font-bold text-gray-900">₹{order.total}</span>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/orders/${order.id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
