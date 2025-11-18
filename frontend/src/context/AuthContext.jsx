import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = "http://localhost:8000/api";

    // ----------------------------------------------------
    // Load user on refresh
    // ----------------------------------------------------
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // ----------------------------------------------------
    // LOGIN
    // ----------------------------------------------------
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

            if (res.status === 200 && data.status === "success") {
                const loggedUser = data.user;

                // Save user
                localStorage.setItem("user", JSON.stringify(loggedUser));
                setUser(loggedUser);

                // ------------------------------------------------
                // Check admin by name
                // ------------------------------------------------
                if (loggedUser.name && loggedUser.name.toLowerCase() === "admin") {
                    navigate("/admin");
                } else {
                    navigate(`/posts/${loggedUser.id}`);
                }

            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------
    // REGISTER
    // ----------------------------------------------------
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

            if (data.status === "success") {
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);

                // After signup redirect normal users
                if (name.toLowerCase() === "admin") {
                    navigate("/admin");
                } else {
                    navigate(`/posts/${data.user.id}`);
                }

            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------
    // LOGOUT
    // ----------------------------------------------------
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
