import axios from 'axios';
import { Product } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const AuthService = {
    syncUser: async (data: { name: string; email: string; universityId: string }, token: string) => {
        return api.post('/auth/sync', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export const ProductService = {
    getAll: async (params?: string) => {
        return api.get(`/products${params ? `?${params}` : ''}`);
    },
    getMine: async () => {
        return api.get('/products/me');
    },
    getOne: async (id: string) => {
        return api.get(`/products/${id}`);
    },
    create: async (data: FormData) => {
        return api.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    update: async (id: string, data: FormData) => {
        return api.put(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: async (id: string) => {
        return api.delete(`/products/${id}`);
    }
};

export const AdminService = {
    // Dashboard stats
    getStats: async () => {
        return api.get('/admin/stats');
    },

    // User management
    getAllUsers: async () => {
        return api.get('/admin/users');
    },
    toggleUserBlock: async (userId: string) => {
        return api.put(`/admin/users/${userId}/toggle-block`);
    },

    // Product management
    getAllProducts: async (status?: string) => {
        return api.get(`/admin/products${status ? `?status=${status}` : ''}`);
    },
    deleteProduct: async (productId: string) => {
        return api.delete(`/products/${productId}`);
    },

    // Order management
    getAllOrders: async () => {
        return api.get('/admin/orders');
    },
    updateOrderStatus: async (orderId: string, status: string) => {
        return api.put(`/admin/orders/${orderId}/status`, { status });
    },

    // Reports management
    getAllReports: async () => {
        return api.get('/admin/reports');
    },
    resolveReport: async (reportId: string, action: string, note?: string) => {
        return api.put(`/admin/reports/${reportId}/resolve`, { action, note });
    },
};

export default api;
