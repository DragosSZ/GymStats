import React, { useState } from "react";

const bgUrl = "/trainer-bg.jpg"; // Use your public folder for static backgrounds

export default function Trainer() {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [confirmedTrainer, setConfirmedTrainer] = useState(null);

    const [trainers, setTrainers] = useState([]);

    React.useEffect(() => {
        fetch("http://localhost:5000/api/trainers")
          .then((res) => res.json())
          .then((data) => setTrainers(data))
          .catch((err) => console.error("Failed to fetch trainers:", err));
    }, []);

    return (
        <div
          className="min-h-screen text-white flex flex-col"
          style={{
            backgroundImage: `linear-gradient(to bottom right, #000000, #000000, #3b0764)`,
          }}
        >
            {/* Header */}
            <div
                className="relative h-44 md:h-52 flex items-center justify-center"
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* <div className="absolute inset-0 bg-black bg-opacity-60"></div> */}
                <div className="relative z-10 text-center py-4">
                    <h1 className="text-4xl font-extrabold mb-4">The Best Trainers in Your Town</h1>
                    <p className="text-lg font-medium text-gray-200">
                        Ready to help jumpstart your fitness journey!
                    </p>
                </div>
            </div>

            {/* Trainers grid */}
            <div className="w-full flex justify-center items-start py-6 -mt-16">
                <div className="bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl px-8 py-10 w-full max-w-6xl">
                    <h2 className="text-2xl font-bold mb-8">Choose your trainer</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {trainers.map((trainer) => (
                          <div key={trainer.id} className="relative flex flex-col items-center">
                            <button
                                className={`flex flex-col items-center focus:outline-none transition-all duration-300 ease-in-out ${
                                    selectedTrainer?.id === trainer.id
                                        ? "scale-105"
                                        : "hover:scale-105"
                                }`}
                                onClick={() => setSelectedTrainer(trainer)}
                            >
                                <img
                                    src={trainer.photo}
                                    alt={trainer.name}
                                    className="w-28 h-28 rounded-full border-4 border-gray-800 shadow-lg object-cover"
                                />
                                <span
                                    className="mt-4 text-lg text-white"
                                    style={{ textDecoration: "none" }}
                                >
                                    {trainer.name}
                                </span>
                            </button>
                          </div>
                        ))}
                    </div>
                </div>
            </div>

            {(selectedTrainer || confirmedTrainer) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-6 rounded-2xl w-80 text-white">
                  {confirmedTrainer ? (
                    <>
                      <img
                        src={confirmedTrainer.photo}
                        alt={confirmedTrainer.name}
                        className="w-24 h-24 rounded-full border-4 border-gray-700 mx-auto mb-4 object-cover"
                      />
                      <p className="text-center mb-4 text-xl font-semibold">
                        🎉 Congrats on starting your adventure with{" "}
                        <span className="font-bold text-blue-400">{confirmedTrainer.name}</span>!
                      </p>
                      <div className="flex justify-center">
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 font-semibold rounded-xl transition"
                          onClick={() => setConfirmedTrainer(null)}
                        >
                          Done
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={selectedTrainer.photo}
                        alt={selectedTrainer.name}
                        className="w-24 h-24 rounded-full border-4 border-gray-700 mx-auto mb-4 object-cover"
                      />
                      <p className="text-center mb-4">
                        Ready to start your journey with{" "}
                        <span className="font-bold text-blue-400">{selectedTrainer.name}</span>?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="px-4 py-2 bg-neutral-700/80 hover:bg-neutral-600/80 rounded-xl transition"
                          onClick={() => setSelectedTrainer(null)}
                        >
                          Go Back
                        </button>
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold rounded-xl transition"
                          onClick={async () => {
                            // Link trainer to user via API
                            const token = localStorage.getItem("token");
                            if (!token) {
                              alert("You must be logged in to select a trainer.");
                              return;
                            }
                            try {
                              const res = await fetch("http://localhost:5000/api/users/set-trainer", {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ TrainerId: selectedTrainer.id }),
                              });
                              if (!res.ok) {
                                const errMsg = await res.text();
                                throw new Error(errMsg || "Failed to set trainer");
                              }
                              setConfirmedTrainer(selectedTrainer);
                              setSelectedTrainer(null);
                            } catch (err) {
                              alert("Failed to set trainer: " + err.message);
                            }
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
    );
}