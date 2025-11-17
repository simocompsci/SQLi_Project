import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info if returned
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000/api";

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email, password) => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Successful login returns: { status, message, user, executed_sql }
    if (res.status === 200 && data.status === "success") {
      const user = data.user; // contains id, name, email, password, etc.

      // Save user to localStorage (no token in vulnerable backend)
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      // Redirect to user's posts
      navigate(`/posts/${user.id}`);
    } else {
      setError(data.message || "Invalid credentials");
    }
  } catch (err) {
    setError("Network error");
  } finally {
    setLoading(false);
  }
};


  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser({ name, email });
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
