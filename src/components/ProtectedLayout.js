import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AppHeader from "./AppHeader";

function ProtectedLayout() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

export default ProtectedLayout;
