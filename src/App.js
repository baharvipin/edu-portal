import React, { Suspense, lazy } from "react";
import { useAuthRedirect } from "./hooks/useAuthRedirect";
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

function App() {
  useAuthRedirect();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
