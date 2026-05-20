import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  ssr: false,
  beforeLoad: async ({ context }) => {
    if (typeof window === "undefined") return;

    const { verifySession } = context.authentication;
    if (typeof verifySession !== "function") return;

    const user = await verifySession();
    console.log("verifySession result:", user);
    if (user) {
      throw redirect({ to: "/pokedex" });
    }
  },
});
