'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader, User, FileText } from 'lucide-react';
import { User as UserType } from '@/lib/types';

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to fetch user');
            const data = await res.json();
            setUser(data.user);
            setFormData({
                name: data.user.name || '',
                bio: data.user.bio || '',
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setSaving(true);

        // Validation
        if (!formData.name.trim()) {
            setErrorMessage('Name is required');
            setSaving(false);
            return;
        }

        if (formData.name.trim().length < 2) {
            setErrorMessage('Name must be at least 2 characters');
            setSaving(false);
            return;
        }

        if (formData.bio && formData.bio.length > 500) {
            setErrorMessage('Bio must be less than 500 characters');
            setSaving(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const data = await res.json();
            setUser(data.user);
            setSuccessMessage('Profile updated successfully!');
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 mt-20 max-w-2xl">
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
                        <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header />

            <div className="container mx-auto px-4 py-8 mt-20 max-w-2xl pb-16">
                {/* Back Button */}
                <div className="mb-8">
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

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                    <p className="text-gray-600">Update your personal information and profile details</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        {errorMessage}
                    </div>
                )}

                {/* Main Form Card */}
                <Card className="border-0 shadow-lg mb-8">
                    <CardHeader className="pb-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <CardTitle className="text-2xl">Personal Information</CardTitle>
                        <CardDescription>Keep your profile information up to date</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name Field */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.name.length}/100 characters
                                </p>
                            </div>

                            {/* Email Display (Read-only) */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Email Address</Label>
                                <Input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="h-12 text-base bg-gray-50 border-gray-200 text-gray-600"
                                />
                                <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            {/* Bio Field */}
                            <div className="space-y-3">
                                <Label htmlFor="bio" className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                    Bio
                                </Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Tell us about yourself... (optional)"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    maxLength={500}
                                    className="min-h-[120px] text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.bio.length}/500 characters
                                </p>
                            </div>

                            {/* Account Status Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-semibold text-blue-900">Account Status</p>
                                <div className="space-y-1 text-sm text-blue-800">
                                    <p>✓ Email verified</p>
                                    <p>✓ Student verified</p>
                                    {user.isAdmin && <p>✓ Admin account</p>}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-11"
                                    onClick={() => router.back()}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 gap-2"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Account Type</p>
                                <p className="text-lg font-bold text-gray-900">{user.isAdmin ? 'Admin' : 'Student'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Member Since</p>
                                <p className="text-lg font-bold text-gray-900">2024</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                                <p className="text-lg font-bold text-green-600">Verified</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}
