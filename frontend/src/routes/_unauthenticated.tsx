import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  ssr: false,
  beforeLoad: async ({ context }) => {
    const user = await context.authentication.verifySession();
    if (user) {
      throw redirect({ to: "/pokedex" });
    }
  },
});
