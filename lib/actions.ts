"use server"

export async function signOut() {
  // Client-side will handle localStorage clearing
  return { success: true }
}

// Simple helper to get user ID from client
export function getCurrentUserId(): string {
  // This will be handled on the client side
  return "guest"
}
