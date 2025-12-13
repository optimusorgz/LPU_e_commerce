"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleRegister(e: any) {
    e.preventDefault();
    console.log("Register clicked", { name, email, password });
    // Later connect backend API here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <Input
          placeholder="Full Name"
          className="mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </Button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
