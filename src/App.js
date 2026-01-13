import React, { Suspense, lazy } from "react";
import Toast from "./components/Toast";
import { useAuthRedirect } from "./hooks/useAuthRedirect";
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

function App() {
  useAuthRedirect();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
      <Toast />
    </Suspense>
  );
}

export default App;
