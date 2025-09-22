import supabase from './supabaseClient';
import { getURL } from '../utils/getURL';

// PUBLIC_INTERFACE
export async function signInWithMagicLink(email, redirectTo) {
  /** Sign in with magic email link using Supabase Auth */
  const finalRedirect = redirectTo || `${getURL()}auth/callback`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: finalRedirect
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
