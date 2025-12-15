"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
} from "lucide-react";

import { registerUser } from "@/lib/auth/register";
import { getPasswordStrength } from "@/lib/utils/passwordStrength";

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(form.password);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur-xl opacity-50" />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-white/20 p-4 rounded-full">
                <Sparkles className="text-white w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-white/70">Sign up to get started</p>
          </div>

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-300 text-sm text-center">
              Verification email sent. Check your inbox.
            </p>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                icon={<User />}
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />

              <InputField
                icon={<Mail />}
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@lpu.in"
              />

              {/* Password */}
              <PasswordField
                label="Password"
                name="password"
                value={form.password}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                onChange={handleChange}
              />

              {form.password && (
                <>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Password strength</span>
                    <span className="font-semibold">{strength.label}</span>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i <= strength.level
                            ? strength.color
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Confirm Password */}
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                show={showConfirmPassword}
                toggle={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading || strength.level < 3}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function InputField({ icon, label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-white/90">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
          {icon}
        </span>
        <input
          {...props}
          required
          className="w-full pl-11 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-white/50 outline-none"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, show, toggle, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-white/90">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          {...props}
          type={show ? "text" : "password"}
          required
          className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-white/50 outline-none"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
