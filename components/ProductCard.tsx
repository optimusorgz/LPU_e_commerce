'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (priceCents: number) => {
        return `₹${(priceCents / 100).toLocaleString()}`;
    };

    return (
        <Link href={`/products/${product.id}`}>
            <Card className="hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm bg-white/80 border-white/20 hover:scale-105 group overflow-hidden h-full flex flex-col">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors flex-1">
                        {product.title}
                    </h3>
                    <div className="mt-auto">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {formatPrice(product.priceCents)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">{product.condition}</span>
                            {product.user && <span className="truncate ml-2 text-xs">{product.user.name}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
