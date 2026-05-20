import { BASE_URL } from "#/lib/api";

interface User {
  id: string;
  username: string;
}

async function login(username: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Authentication failed");
  const data = await response.json();
  localStorage.setItem("auth-token", data.token);
  return { id: data.id, username: data.username };
}

function logoutUser() {
  if (window.confirm("want to logout?")) {
    localStorage.removeItem("auth-token");
    window.location.href = "/login";
  }
}

function getStoredUser(): User | null {
  const token = localStorage.getItem("auth-token");
  if (!token) return null;
  return null;
}

async function register(
  name: string,
  username: string,
  password: string,
): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  const data = await response.json();
  localStorage.setItem("auth-token", data.token);
  return { id: data.id, username: data.username };
}

async function verifySession(): Promise<User | null> {
  const token = localStorage.getItem("auth-token");
  if (!token) return null;
  const response = await fetch(`${BASE_URL}/api/v1/auth/validate-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json();
}

export const authentication = {
  login,
  logoutUser,
  getStoredUser,
  register,
  verifySession,
};
export type AuthHook = typeof authentication;
