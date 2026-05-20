import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const verifySession = async () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return null;
  const response = await fetch(
    "http://localhost:3000/api/v1/auth/validate-token",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) return null;
  const data = await response.json();
  console.log(data);
  return data;
};
