import { BASE_URL } from "#/lib/api";
interface User {
  id: string;
  username: string;
}
export async function login(username: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Authentication failed");
  }
  const data = await response.json();
  localStorage.setItem("auth-token", data.token);
  return { id: data.id, username: data.username };
}
export function logoutUser() {
  if (window.confirm("want to logout?")) {
    localStorage.removeItem("auth-token");
    window.location.href = "/login";
  }
}
export function getStoredUser(): User | null {
  const token = localStorage.getItem("auth-token");
  if (!token) return null;
  return null; // token exists but user info isn't stored client-side
}
