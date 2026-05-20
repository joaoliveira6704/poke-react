import { verifySession } from "#/lib/utils";
import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    try {
      console.log("verifying user");
      const user = await verifySession();

      if (!user) {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
      return { user };
    } catch (error) {
      if (isRedirect(error)) throw error;

      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});
