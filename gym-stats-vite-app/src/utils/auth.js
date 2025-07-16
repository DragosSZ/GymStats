import jwtDecode from "jwt-decode";

export function getAuthStatus() {
    const token = localStorage.getItem("token");
    if (!token) return { isLoggedIn: false, isTrainer: false, userId: null, token: null, user: null };

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return { isLoggedIn: false, isTrainer: false, userId: null, token: null, user: null };
        }

        return {
            isLoggedIn: true,
            isTrainer: decoded.role === "trainer",
            userId: decoded.sub,
            token,
            user: decoded
        };
    } catch (e) {
        localStorage.removeItem("token");
        return { isLoggedIn: false, isTrainer: false, userId: null, token: null, user: null };
    }
}