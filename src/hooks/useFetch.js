import { useEffect, useState } from "react";
import { showToast } from "../utility/toastService";

export default function useFetch(url, options = {}, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return; // 🔴 key line
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}${url}`,
          {
            method: options.method || "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : undefined,
              ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
          },
        );

        const result = await response.json();
        console.log("result", result);

        if (!response.ok) {
          const msg = result?.message || "Something went wrong";
          try {
            showToast(msg, "error");
          } catch (e) {}
          throw new Error(msg);
        }

        if (isMounted) {
          setData(result);
          setError(null);
        }

        // Show success toast for non-GET operations when API returns a message
        const method = (options.method || "GET").toUpperCase();
        if (method == "GET" && result && result.message) {
          console.log("gett");
          showToast(result.message, "success");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
        try {
          showToast(err.message || "Request failed", "error");
        } catch (e) {}
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, enabled, options.method, JSON.stringify(options.body)]); // Added options.refreshKey as dependency

  return { data, loading, error };
}
