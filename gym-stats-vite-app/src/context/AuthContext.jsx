import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        isTrainer: false,
        userId: null,
        token: null,
        user: null
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const rawToken = storedToken.startsWith("Bearer ")
                    ? storedToken.split(" ")[1]
                    : storedToken;

                const decoded = jwtDecode(rawToken);

                if (decoded.exp * 1000 > Date.now()) {
                    const parsedUser = JSON.parse(storedUser);
                    setAuth({
                        isLoggedIn: true,
                        isTrainer: decoded.role === "trainer",
                        userId: decoded.sub,
                        token: rawToken,
                        user: parsedUser
                    });
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("Failed to decode token:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};