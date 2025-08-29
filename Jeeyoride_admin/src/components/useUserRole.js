// src/hooks/useUserRole.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config";

const useUserRole = () => {
  const [userrole, setUserrole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin_profile`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUserrole(data.userrole);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        navigate("/");
      }
    };

    fetchSession();
  }, [navigate]);

  return userrole;
};

export default useUserRole;
