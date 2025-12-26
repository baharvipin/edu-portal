import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

function ProtectedLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

export default ProtectedLayout;
