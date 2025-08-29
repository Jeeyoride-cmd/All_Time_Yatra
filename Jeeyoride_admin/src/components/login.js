import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import { BASE_URL } from "./config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/admin_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ enables cookies/sessions
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("🟢 Response:", data);

      if (response.ok) {
        console.log("✅ Session should now be set in cookie.");
        // You can optionally fetch session debug info
        const checkSession = await fetch(`${BASE_URL}/admin_profile`, {
          credentials: "include",
        });
        const sessionData = await checkSession.json();
        console.log("🧠 Session data from server:", sessionData);

        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="right-container__box">
        <h2>Login</h2>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={login} className="input-container">
          <label className="right-container__label">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="right-container__label">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
