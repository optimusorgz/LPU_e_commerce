export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    universityId?: string;
    isAdmin: boolean;
    isBlocked?: boolean;
    bio?: string;
    createdAt?: string;
}

export interface Product {
    id: string;
    userId: string;
    title: string;
    slug: string;
    description?: string;
    priceCents: number;
    currency: string;
    category?: string;
    condition?: 'new' | 'like-new' | 'good' | 'fair';
    images?: string[];
    location?: string;
    status: 'pending' | 'available' | 'sold' | 'rejected';
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        avatarUrl?: string;
        universityId?: string;
    };
}

export interface Order {
    id: string;
    productId?: string;
    buyerId: string;
    sellerId: string;
    status: 'placed' | 'confirmed' | 'delivered' | 'cancelled';
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    updatedAt: string;
    product?: Product;
    buyer?: User;
    seller?: User;
}

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
    product?: Product;
}

export interface Report {
    id: string;
    productId: string;
    reportedBy: string;
    reason: string;
    status: 'pending' | 'resolved';
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
    product?: Product;
    reporter?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    pendingProducts: number;
    paidOrders: number;
}
