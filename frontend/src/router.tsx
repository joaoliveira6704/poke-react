import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "./integrations/tanstack-query/root-provider";
import type { AuthHook } from "./hooks/useAuth";

export function getRouter(authentication?: AuthHook) {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient: context.queryClient,
      authentication: authentication ?? ({} as AuthHook),
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
