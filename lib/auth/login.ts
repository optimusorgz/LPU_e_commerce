import { supabase } from "@/lib/supabaseClient";

type LoginInput = {
  email: string;
  password: string;
};

export async function loginUser({ email, password }: LoginInput) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
