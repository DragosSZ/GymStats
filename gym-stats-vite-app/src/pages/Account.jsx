import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Account() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            navigate("/login", { replace: true });
            return;
        }
        fetch("http://localhost:5000/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }
                return res.json();
            })
            .then((data) => {
                setUserData(data);
                setAuth((prev) => ({
                    ...prev,
                    user: data,
                    token,
                    isLoggedIn: true,
                    isTrainer: data.role === "trainer",
                    userId: data._id,
                }));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setLoading(false);
            });
    }, [navigate, setAuth]);

    if (loading) {
        return null;
    }

    return (
        <>
            {editing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative bg-neutral-800 p-6 rounded-lg w-full max-w-md space-y-4 text-sm shadow-lg">
                        <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const token = localStorage.getItem("token");
                                // Input validation for required fields
                                if (!userData.firstName || !userData.lastName || !userData.dateOfBirth) {
                                    alert("Please fill out all required fields.");
                                    return;
                                }
                                fetch("http://localhost:5000/api/users/me", {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                        firstName: userData.firstName,
                                        lastName: userData.lastName,
                                        weight: parseFloat(userData.weight) || 0,
                                        height: parseFloat(userData.height) || 0,
                                        pictureUrls: userData.avatarUrl ? [userData.avatarUrl] : [],
                                        dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
                                    }),
                                })
                                    .then((res) => {
                                        if (!res.ok) throw new Error("Update failed");
                                        alert("Profile updated");
                                        setEditing(false);
                                    })
                                    .catch((err) => {
                                        console.error("Update error:", err);
                                        alert("Failed to update profile");
                                    });
                            }}
                        >
                            <input
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                type="text"
                                value={userData?.firstName || ""}
                                onChange={(e) => setUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                                placeholder="First Name"
                            />
                            <input
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                type="text"
                                value={userData?.lastName || ""}
                                onChange={(e) => setUserData((prev) => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Last Name"
                            />
                            <input
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                type="number"
                                value={userData?.weight || ""}
                                onChange={(e) => setUserData((prev) => ({ ...prev, weight: e.target.value }))}
                                placeholder="Weight"
                            />
                            <input
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                type="number"
                                value={userData?.height || ""}
                                onChange={(e) => setUserData((prev) => ({ ...prev, height: e.target.value }))}
                                placeholder="Height"
                            />
                            <input
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                                type="date"
                                value={userData?.dateOfBirth?.split("T")[0] || ""}
                                onChange={(e) => setUserData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                                placeholder="Date of Birth"
                            />
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md placeholder:text-gray-400"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setUserData((prev) => ({ ...prev, avatarUrl: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-between pt-4">
                                <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow">
                                    Save
                                </button>
                                <button type="button" onClick={() => setEditing(false)} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold shadow">
                                    Cancel
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!confirm("Are you sure you want to delete your account?")) return;
                                    const token = localStorage.getItem("token");
                                    fetch("http://localhost:5000/api/users/me", {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    })
                                        .then((res) => {
                                            if (!res.ok) throw new Error("Delete failed");
                                            alert("Account deleted");
                                            localStorage.removeItem("token");
                                            navigate("/login", { replace: true });
                                        })
                                        .catch((err) => {
                                            console.error("Delete error:", err);
                                            alert("Failed to delete account");
                                        });
                                }}
                                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold shadow w-full mt-4"
                            >
                                Delete Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="bg-gradient-to-br from-black via-black to-purple-600 text-gray-300 min-h-screen pb-16 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg max-w-6xl w-full px-6 py-12 mx-auto mt-24">
                {/* Top: Title and sign up/login */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white">Your Account</h1>
                    <button onClick={() => setEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow">
                        Edit Profile
                    </button>
                </div>
                {/* Main info */}
                <div className="flex flex-col md:flex-row gap-10 mb-14">
                    {/* Avatar with upload */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <img
                            src={userData?.pictureUrls?.[0] || "https://i.imgur.com/WPZ8b9k.png"}
                            alt="avatar"
                            className="w-60 h-60 md:w-72 md:h-72 rounded-2xl object-cover bg-gray-700 mb-4"
                        />
                    </div>
                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center gap-4 text-lg md:text-xl text-gray-400 font-medium pl-4">
                        <div>
                            <div className="text-gray-500 text-sm">Name</div>
                            <div>{(userData?.firstName || "") + " " + (userData?.lastName || "") || "Name"}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Email</div>
                            <div>{userData?.email || "Email"}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Date of Birth</div>
                            <div>{userData?.dateOfBirth || "Date of birth"}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Weight</div>
                            <div>{userData?.weight ? `${userData.weight} kg` : "Weight"}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Height</div>
                            <div>{userData?.height ? `${userData.height} cm` : "Height"}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-3">Your Trainer</h2>
                    <div className="flex items-center gap-5">
                        {userData?.trainer ? (
                            <>
                                <img
                                    src={userData.trainer.avatarUrl || "https://i.imgur.com/WPZ8b9k.png"}
                                    alt="trainer avatar"
                                    className="w-20 h-20 rounded-full object-cover bg-gray-700"
                                />
                                <span className="text-xl font-semibold text-gray-300 italic">{userData.trainer.name || "*name*"}</span>
                            </>
                        ) : (
                            <div className="text-lg font-semibold text-white bg-white/10 border border-white/20 rounded-xl px-6 py-4 shadow-inner">
                                You don't have a trainer yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}