'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Image as ImageIcon, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductService } from '@/lib/api';

export default function ProductForm() {
    const [images, setImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        condition: '',
        description: '',
        location: ''
    });

    const categories = [
        "Electronics", "Books", "Furniture", "Clothing", "Sports", "Accessories", "Other"
    ];

    const conditions = [
        "New", "Like New", "Good", "Fair"
    ];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const newFiles = Array.from(files);
        setSelectedFiles(prev => [...prev, ...newFiles]);

        const newImages = newFiles.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('price', formData.price); // Backend expects number or string? Checking backend might be good but sticking to plan.
            formDataObj.append('category', formData.category);
            formDataObj.append('condition', formData.condition);
            formDataObj.append('description', formData.description);
            formDataObj.append('location', formData.location);

            // Note: images logic in frontend seems to be mock-only (createObjectURL). 
            // In a real app we'd need actual files. 
            // The fileInputRef has the files but they are not stored in state separate from URLs in this implementation?
            // Wait, handleFiles just creates URLs. I need the actual files to upload.
            // I'll need to modify handleFiles to store files too.

            // For now, I will assume the user needs to select files again or I need to refactor state to hold files.
            // Refactoring state to hold files.

            if (selectedFiles.length > 0) {
                selectedFiles.forEach(file => {
                    formDataObj.append('images', file);
                });
            }

            await ProductService.create(formDataObj);
            router.push('/my-products');
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
                <Label className="text-lg font-semibold">Product Images</Label>
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
                        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                        <p className="text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Engineering Mathematics Textbook"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="price"
                            type="number"
                            className="pl-9"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(cat => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium border transition-all text-left",
                                        formData.category === cat
                                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Condition</Label>
                        <div className="grid grid-cols-1 gap-2">
                            {conditions.map(cond => (
                                <button
                                    type="button"
                                    key={cond}
                                    onClick={() => setFormData({ ...formData, condition: cond })}
                                    className={cn(
                                        "px-4 py-3 rounded-lg text-sm font-medium border transition-all flex items-center justify-between group",
                                        formData.condition === cond
                                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    )}
                                >
                                    {cond}
                                    <div className={cn(
                                        "w-3 h-3 rounded-full border",
                                        formData.condition === cond ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your item..."
                        className="min-h-[150px]"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="location">Campus Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g. Student Center, North Hall"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Posting..." : "Post Product"}
            </Button>
        </form>
    );
}
