import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("trainee");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ firstName, lastName, email, password, role })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Signup failed");
            }

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-purple-600 text-gray-300 m-0 p-0">
            <div className="bg-white/10 via-white/5 backdrop-blur-xl border border-white/20 p-10 rounded-lg shadow-lg w-full max-w-3xl mx-auto px-4 md:px-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10">Sign up</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">First name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Last name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Role</label>
                      <div className="flex gap-4">
                        {["trainee", "trainer"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setRole(option)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl w-full justify-center transition border shadow-md ${
                              role === option
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 border-white/20 text-white"
                                : "bg-gradient-to-r from-neutral-800 to-neutral-900 border-white/20 text-gray-400"
                            }`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
                    >
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}