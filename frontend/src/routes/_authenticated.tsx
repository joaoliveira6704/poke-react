import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { requireAuth } from "#/lib/router-auth";
import { useEffect } from "react";
import { useAuth } from "#/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.href } });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return null;

  return <Outlet />;
}
