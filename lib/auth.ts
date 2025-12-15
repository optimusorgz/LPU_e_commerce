import { supabase } from "./supabase/supabaseClient";

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
