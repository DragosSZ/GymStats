import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const { isLoggedIn, isTrainer, setAuth } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: "Programs", path: "/programs" },
        ...(
            isLoggedIn
                ? (isTrainer
                    ? [{ name: "Clients", path: "/clients" }]
                    : [{ name: "Trainer", path: "/trainer" }])
                : []
        ),
        { name: "About", path: "/about" },
        ...(isLoggedIn ? [{ name: "Account", path: "/account" }] : [{ name: "Login", path: "/login" }]),
    ];
    console.log("Auth context:", { isLoggedIn, isTrainer });

    return (
        <header className="bg-gradient-to-br from-purple-700 to-black text-white px-6 py-4 border-b border-white/10 shadow-md">
            <div className="max-w-12xl mx-auto flex items-center justify-between w-full">
                <Link to="/" className="font-extrabold text-3xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Gym Stats
                </Link>
                <nav className="flex gap-4 ml-auto">
                    {navLinks.map(({ name, path }) => (
                        <Link key={name} to={path}>
                            <button
                                className={`rounded-xl px-6 py-2 font-semibold transition duration-200 transform hover:scale-105 ${
                                    location.pathname === path
                                        ? "bg-white text-purple-700 shadow"
                                        : "bg-white/10 text-white hover:bg-white/20"}`}
                            >
                                {name}
                            </button>
                        </Link>
                    ))}
                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setAuth({
                                    isLoggedIn: false,
                                    isTrainer: false,
                                    userId: null,
                                    token: null,
                                    user: null
                                });
                                navigate("/");
                            }}
                            className="ml-4 rounded-xl px-6 py-2 font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white transition duration-200 transform hover:scale-105 shadow"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}