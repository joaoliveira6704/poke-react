import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Pokemark - Dashboard" }],
  }),
});

function Dashboard() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Welcome!</h1>
        </div>
      </div>
    </>
  );
}
