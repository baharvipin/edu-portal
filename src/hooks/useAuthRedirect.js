import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => { 
    const userRole = localStorage.getItem("userRole");
    const status = localStorage.getItem("status");

    // SCHOOL ADMIN
    if (userRole === "ADMIN") {
      if (status === "PROFILE_INCOMPLETE") {
        navigate("/school/profile", { replace: true });
        return;
      }
      if (status === "PROFILE_SUBMITTED") {
        navigate("/school/pending-approval", { replace: true });
        return;
      }

      // if ( status === "ACTIVE") {
      //   navigate("/dashboard", { replace: true });
      //   return;
      // }

      if (status === "SUSPENDED") {
        navigate("/account/suspended", { replace: true });
        return;
      }

      if (status === "INACTIVE") {
        navigate("/account/deactivated", { replace: true });
        return;
      }
      if (status === "REJECTED") {
        navigate("/school/rejected", { replace: true });
        return;
      }
    }
  }, [navigate]);
};
