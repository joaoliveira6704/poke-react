import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { useAuth } from "./hooks/useAuth";
import { useRef } from "react";

function App() {
  const authentication = useAuth();

  const routerRef = useRef(getRouter(authentication));

  return (
    <RouterProvider router={routerRef.current} context={{ authentication }} />
  );
}

export default App;
