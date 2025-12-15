import { supabase } from "@/lib/supabaseClient";

const UNIVERSITY_EMAIL_REGEX = /^[^\s@]+@lpu\.in$/i;

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function registerUser({
  fullName,
  email,
  password,
  confirmPassword,
}: RegisterInput) {
  if (!fullName.trim()) {
    throw new Error("Full name is required");
  }

  if (!UNIVERSITY_EMAIL_REGEX.test(email)) {
    throw new Error("Use your university email (e.g. student@lpu.in)");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name: fullName.trim() },
      emailRedirectTo: `${location.origin}/auth/verify`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
