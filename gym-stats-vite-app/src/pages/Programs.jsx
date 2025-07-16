import { Link } from "react-router-dom";


export default function Programs() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-600 text-gray-100 pt-24 pb-16 flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-6xl mx-auto px-6 py-12">
                <div className="w-full px-8 md:px-16 pt-14">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 drop-shadow-md">Programs</h1>

                    <div className="flex flex-col gap-6">
                        {/* Workout Tracker (route: /workout-builder) */}
                        <Link to="/workout-builder" className="block mb-8">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 transition hover:shadow-xl">
                                <div className="md:flex gap-6 items-center">
                                    <img
                                        src="src/assets/workout.png"
                                        alt="Workout Tracker"
                                        className="rounded-lg w-full md:w-80 h-64 object-cover filter blur-[2px] brightness-75 mb-4 md:mb-0"
                                        draggable={false}
                                    />
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Workout Tracker</h2>
                                        <p className="text-lg text-gray-200">Track your daily workout sets, reps, and weights. Visualize progress over time to optimize your training.</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Progress Tracker */}
                        <Link to="/progress-tracker" className="block mb-8">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 transition hover:shadow-xl">
                                <div className="md:flex md:flex-row-reverse gap-6 items-center">
                                    <img
                                        src="src/assets/progress2.png"
                                        alt="Progress Tracker"
                                        className="rounded-lg w-full md:w-80 h-64 object-cover filter blur-[1.5px] brightness-90 mb-4 md:mb-0"
                                        draggable={false}
                                    />
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Progress Tracker</h2>
                                        <p className="text-lg text-gray-200">Log your weight and visual progress over weeks or months. See how far you've come in your transformation.</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Meal Planning */}
                        <Link to="/meal-planning" className="block mb-8">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 transition hover:shadow-xl">
                                <div className="md:flex gap-6 items-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                                        alt="Meal Planning"
                                        className="rounded-lg w-full md:w-80 h-64 object-cover filter blur-[1.5px] brightness-90 mb-4 md:mb-0"
                                        draggable={false}
                                    />
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Meal Planning</h2>
                                        <p className="text-lg text-gray-200">Plan your meals for the week and track your nutrition to support your fitness goals.</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}