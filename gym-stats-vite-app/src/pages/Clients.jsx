import { useState, useEffect } from 'react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    age: '',
    height: '',
    startDate: '',
    type: 'online',
    startingWeight: '',
  });
  const [expandedClients, setExpandedClients] = useState([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Fetch trainer's clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/trainees", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch clients");

        const data = await res.json();
        // Add more detailed client info, fetching latest plan goals for each client
        const formattedClients = await Promise.all(data.map(async (user) => {
          const plansRes = await fetch(`http://localhost:5000/api/nutrition-plans/for-user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const plansData = await plansRes.json();
          let latestGoals = {};
          if (plansData.length > 0) {
            const plan = plansData[0];
            console.log(`Plan for user ${user.id}:`, plan);
            latestGoals = plan.goals || {};
          }

          return {
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            avatarUrl: user.avatarUrl || "src/assets/default-avatar.png",
            age: user.age,
            height: user.height,
            startDate: user.startDate,
            startingWeight: user.startingWeight,
            type: user.type,
            checkIns: [],
            goals: latestGoals,
          };
        }));

        setClients(formattedClients);
        console.log("Fetched clients:", formattedClients);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClients();
  }, []);

  const handleAddClient = () => {
    if (!newClient.email || !newClient.password) return;
    const id = Date.now();
    setClients([...clients, { id, ...newClient, checkIns: [], goals: {} }]);
    setNewClient({
      email: '',
      password: '',
      name: '',
      surname: '',
      age: '',
      height: '',
      startDate: '',
      type: 'online',
      startingWeight: '',
    });
  };

  const updateClientGoals = (id, newGoals) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, goals: newGoals } : client
      )
    );
  };

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-600 text-white p-6 flex flex-col gap-6">

        {/* Glassy Header Section at the top */}
        <div className="w-full max-w-20xl mx-auto px-6 pt-1">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg px-6 py-4 flex items-center justify-start">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mr-auto">
              Trainer Clients
            </h1>
            <button
              onClick={() => setShowNewClientForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
            >
              + Add Client
            </button>
          </div>
        </div>

        {/* Modal for adding new client */}
        {showNewClientForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-neutral-800 p-6 rounded-lg w-full max-w-md space-y-4 text-sm shadow-lg">
              <button
                onClick={() => setShowNewClientForm(false)}
                className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold">Add New Client</h2>
              <input
                type="email"
                placeholder="Client Email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={newClient.password}
                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="First Name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newClient.surname}
                onChange={(e) => setNewClient({ ...newClient, surname: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="number"
                placeholder="Age"
                value={newClient.age}
                onChange={(e) => setNewClient({ ...newClient, age: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={newClient.height}
                onChange={(e) => setNewClient({ ...newClient, height: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="number"
                placeholder="Starting Weight (kg)"
                value={newClient.startingWeight}
                onChange={(e) => setNewClient({ ...newClient, startingWeight: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newClient.startDate}
                onChange={(e) => setNewClient({ ...newClient, startDate: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <select
                value={newClient.type}
                onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              >
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>
              <button
                onClick={() => { handleAddClient(); setShowNewClientForm(false); }}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Client
              </button>
            </div>
          </div>
        )}

        {/* Client list below header and modal */}
        <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl w-full max-w-6xl p-6 mx-auto space-y-4">
          {clients.length === 0 ? (
            <p className="text-center text-gray-400">No clients assigned yet.</p>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md border border-white/20 rounded-xl shadow-md p-4">
                <div className="flex justify-between items-center">
                  {/* Inline client info with small avatar */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={client.avatarUrl}
                      alt={`${client.name} ${client.surname}`}
                      className={`rounded-full object-cover transition-all duration-300 ease-in-out border-2 border-white ${
                        expandedClients.includes(client.id) ? "w-48 h-48" : "w-16 h-16"
                      }`}
                    />
                    <div>
                      <p className="font-semibold">{client.name} {client.surname}</p>
                      <p className="text-sm text-gray-300">Age: {client.age}</p>
                      <p className="text-sm text-gray-300">Email: {client.email}</p>
                      <p className="text-sm text-gray-300">Weight: {client.startingWeight} kg</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedClients(prev =>
                        prev.includes(client.id)
                          ? prev.filter(id => id !== client.id)
                          : [...prev, client.id]
                      )
                    }
                  >
                    {expandedClients.includes(client.id) ? 'Hide' : 'View'}
                  </button>
                </div>
                {expandedClients.includes(client.id) && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-medium">Latest Check-Ins</h3>
                  {client.checkIns.length === 0 ? (
                    <p className="text-gray-400 text-sm">No check-ins yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {client.checkIns.map((entry, i) => (
                        <li key={i}>
                          <p className="text-sm">{entry.date} - {entry.weight} kg</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {entry.photos?.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="Check-in"
                                className="w-20 h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mt-4">Meal Goals</h4>
                    {(() => {
                      // Calculate macro grams from kcal if needed
                      const kcal = parseFloat(client.goals.kcal || 0);
                      const proteinG =
                        client.goals.protein !== undefined && client.goals.protein !== ''
                          ? client.goals.protein
                          : kcal
                          ? ((kcal * 0.20) / 4).toFixed(1)
                          : '';
                      const carbsG =
                        client.goals.carbs !== undefined && client.goals.carbs !== ''
                          ? client.goals.carbs
                          : kcal
                          ? ((kcal * 0.50) / 4).toFixed(1)
                          : '';
                      const fatG =
                        client.goals.fat !== undefined && client.goals.fat !== ''
                          ? client.goals.fat
                          : kcal
                          ? ((kcal * 0.30) / 9).toFixed(1)
                          : '';
                      return (
                        <>
                          <div>
                            <label className="block text-sm mb-1">Protein (g)</label>
                            <input
                              type="text"
                              value={proteinG}
                              onChange={(e) =>
                                updateClientGoals(client.id, {
                                  ...client.goals,
                                  protein: e.target.value,
                                })
                              }
                              className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Carbs (g)</label>
                            <input
                              type="text"
                              value={carbsG}
                              onChange={(e) =>
                                updateClientGoals(client.id, {
                                  ...client.goals,
                                  carbs: e.target.value,
                                })
                              }
                              className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Fat (g)</label>
                            <input
                              type="text"
                              value={fatG}
                              onChange={(e) =>
                                updateClientGoals(client.id, {
                                  ...client.goals,
                                  fat: e.target.value,
                                })
                              }
                              className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            Estimated Kcal: {(() => {
                              const p = parseFloat(proteinG) || 0;
                              const c = parseFloat(carbsG) || 0;
                              const f = parseFloat(fatG) || 0;
                              return Math.round(p * 4 + c * 4 + f * 9);
                            })()}
                          </p>
                          <button
                            onClick={async () => {
                              const token = localStorage.getItem("token");
                              try {
                                await fetch("http://localhost:5000/api/nutrition-plans", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    traineeId: client.id,
                                    startDate: new Date().toISOString(),
                                    meals: [],
                                    goals: {
                                      protein: proteinG,
                                      carbs: carbsG,
                                      fat: fatG,
                                      kcal: (parseFloat(proteinG) * 4 + parseFloat(carbsG) * 4 + parseFloat(fatG) * 9).toFixed(0)
                                    }
                                  })
                                });
                                alert("Macros saved successfully!");
                              } catch (error) {
                                console.error("Error saving macros:", error);
                                alert("Failed to save macros.");
                              }
                            }}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
                          >
                            Save Macros
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Stop Collaborating Button */}
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      try {
                        const res = await fetch(`http://localhost:5000/api/users/remove-trainer/${client.id}`, {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        if (res.ok) {
                          setClients(prev => prev.filter(c => c.id !== client.id));
                        } else {
                          console.error("Failed to remove trainer");
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="mt-4 bg-red-600 px-4 py-2 rounded-xl text-white hover:bg-red-700 transition shadow"
                  >
                    Stop Collaborating
                  </button>
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}