import { redirect } from "@tanstack/react-router";

export function requireAuth({ location }: { location: { href: string } }) {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  }
}
