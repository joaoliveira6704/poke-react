import { useState } from "react";
import { LoginForm } from "#/components/forms/login-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { login } from "../auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    redirect: search.redirect,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: FormData) => {
    const username = data.get("username") as string | null;
    const password = data.get("password") as string | null;

    if (!username || !password) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate({ to: redirectTo || "/" });
    } catch {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <LoginForm onLogin={handleLogin} loading={loading} />
      </div>
    </div>
  );
}
