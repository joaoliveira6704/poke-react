import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Pokemark - Home" }],
  }),
});

function RouteComponent() {
  return <div>Hello "/home"!</div>;
}
