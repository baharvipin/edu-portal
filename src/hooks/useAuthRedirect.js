import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    const status = localStorage.getItem("status");

    // Not logged in
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // SUPER ADMIN
    if (userRole === "SUPER_ADMIN") {
      navigate("/superadmin/profile", { replace: true });
      return;
    }

    // SCHOOL ADMIN
    if (userRole === "ADMIN") {
      if (status === "PROFILE_INCOMPLETE") {
        navigate("/school/profile", { replace: true });
        return;
      }

      if (status === "PROFILE_SUBMITTED" || status === "ACTIVE") {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (status === "SUSPENDED") {
        navigate("/account/suspended", { replace: true });
        return;
      }

      if (status === "INACTIVE") {
        navigate("/account/deactivated", { replace: true });
        return;
      }
    }
  }, [navigate]);
};
