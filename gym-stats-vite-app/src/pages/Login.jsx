import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";

export default function Login() {
    const { setAuth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Login failed");
            }

            const result = await response.json();
            localStorage.setItem("token", result.token);
            localStorage.setItem("userId", result.user.id);
            setAuth({
                isLoggedIn: true,
                isTrainer: result.user.role === "trainer",
                userId: result.user.id,
                token: result.token,
                user: result.user
            });
            navigate("/account");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-black to-purple-600">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-lg shadow-lg max-w-xl w-full text-white flex flex-col gap-6">
                <div className="text-5xl leading-tight font-bold text-center">
                    Welcome Back!
                </div>
                <p className="text-xl font-normal text-center">
                    We're excited to see you again. Log in to continue your fitness journey.
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm mb-1">Email address</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold hover:underline"
                    >
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
}