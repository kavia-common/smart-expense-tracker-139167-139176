import supabase from './supabaseClient';

// PUBLIC_INTERFACE
export async function signInWithMagicLink(email, redirectTo) {
  /** Sign in with magic email link using Supabase Auth */
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });
  if (error) throw error;
  return true;
}

// PUBLIC_INTERFACE
export async function signOut() {
  /** Sign out current session */
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

// PUBLIC_INTERFACE
export function onAuthStateChange(callback) {
  /** Subscribe to auth changes */
  return supabase.auth.onAuthStateChange(callback);
}
