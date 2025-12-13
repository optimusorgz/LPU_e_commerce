"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: any) {
    e.preventDefault();
    console.log("Login clicked", { email, password });
    // Later connect backend API here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <Input
          placeholder="Email"
          type="email"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
