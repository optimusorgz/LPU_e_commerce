'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PostProductPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>

                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell an Item</h1>
                        <p className="text-gray-600">List your item for sale in the campus marketplace.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <ProductForm />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
