import { useState } from "react";
import { RegisterForm } from "#/components/forms/register-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { register } from "#/auth";

export const Route = createFileRoute("/_unauthenticated/register")({
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

  const handleRegister = async (data: FormData) => {
    const name = data.get("name") as string | null;
    const username = data.get("username") as string | null;
    const password = data.get("password") as string | null;

    if (!username || !password) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await register(name, username, password);
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
        <RegisterForm onRegister={handleRegister} loading={loading} />
      </div>
    </div>
  );
}
