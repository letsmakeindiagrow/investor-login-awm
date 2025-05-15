import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

const checkAuth = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/investor/checkAuth`, {
      withCredentials: true,
    });
    return res.data.authenticated;
  } catch {
    console.log("Not authenticated");
  }
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthenticationAndRedirect = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        window.location.href = REDIRECT_URL;
      } else {
        navigate("/");
      }
    };

    verifyAuthenticationAndRedirect();
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
