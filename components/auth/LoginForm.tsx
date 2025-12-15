"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";

import { loginUser } from "@/lib/auth/login";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    await loginUser({ email, password });
    const result = await loginUser({ email, password });
    console.log("loginUser result:", result);
    console.log("document.cookie:", document.cookie);


    // ✅ FORCE full reload so middleware sees cookies
    window.location.href = "/dashboard";
  } catch (err: any) {
    setError(err.message ?? "Login failed");
  } finally {
    setIsLoading(false);
  }
}


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4 relative overflow-hidden">
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>

        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-md"></div>
                <div className="relative bg-white/20 p-4 rounded-full">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/70">Sign in to continue</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm text-white/90">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/50 outline-none"
                  placeholder="student@lpu.in"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-white/90">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-white/70">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-white underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
