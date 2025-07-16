import React, { useState, useEffect } from "react";

export default function MealPlanning() {
    const [goals, setGoals] = useState({ kcal: 0, protein: 0, carbs: 0, fat: 0 });

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
      const fetchGoals = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Assumes userId is stored after login
        if (!token || !userId) return;

        try {
          const res = await fetch(`http://localhost:5000/api/nutrition-plans/for-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const plans = await res.json();
          if (plans.length > 0 && plans[0].goals) {
            const g = plans[0].goals;
            setGoals({
              kcal: parseFloat(g.kcal),
              protein: parseFloat(g.protein),
              carbs: parseFloat(g.carbs),
              fat: parseFloat(g.fat),
            });
          }
          console.log("Fetched plans:", plans);
        } catch (err) {
          console.error("Failed to load nutrition goals:", err);
        }
      };

      fetchGoals();
    }, []);
    const [meals, setMeals] = useState([
        [
            { name: "Oats", kcal: 300, protein: "10", carbs: "50", fat: "5", weight: "100" },
            { name: "Banana", kcal: 100, protein: "1", carbs: "27", fat: "0.3", weight: "100" },
        ]
    ]);
    const [editingIndex, setEditingIndex] = useState(null); // { mealIdx, index } or null
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: "", weight: "", kcal: "", protein: "", carbs: "", fat: "" });

    useEffect(() => {
      const saveMeals = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const today = new Date().toISOString().split("T")[0];

        if (!token || !userId) return;

        try {
          await fetch("http://localhost:5000/api/nutrition-plans/save-meals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              traineeId: userId,
              date: today,
              meals,
            }),
          });
        } catch (err) {
          console.error("Error saving meals:", err);
        }
      };

      saveMeals();
    }, [meals]);


    const handleAddMeal = () => {
      setMeals([...meals, []]);
    };

    /*const handleAddNew = () => {
      setFormData({ name: "", weight: "", kcal: "", protein: "", carbs: "", fat: "" });
      setIsAdding(true);
      setEditingIndex(null);
    };*/

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const updated = [...meals];
      if (isAdding) {
        if (updated.length === 0) updated.push([]);
        let weightInGrams = parseFloat(formData.weight || 100);
        const w = weightInGrams / 100;
        updated[updated.length - 1].push({
          name: formData.name,
          kcal: (parseFloat(formData.kcal) * w).toFixed(1),
          protein: (parseFloat(formData.protein) * w).toFixed(1),
          carbs: (parseFloat(formData.carbs) * w).toFixed(1),
          fat: (parseFloat(formData.fat) * w).toFixed(1),
          weight: `${weightInGrams.toFixed(1)}`,
        });
      } else if (editingIndex) {
        let weightInGrams = parseFloat(formData.weight || 100);
        const w = weightInGrams / 100;
        updated[editingIndex.mealIdx][editingIndex.index] = {
          name: formData.name,
          kcal: (parseFloat(formData.kcal) * w).toFixed(1),
          protein: (parseFloat(formData.protein) * w).toFixed(1),
          carbs: (parseFloat(formData.carbs) * w).toFixed(1),
          fat: (parseFloat(formData.fat) * w).toFixed(1),
          weight: `${weightInGrams.toFixed(1)}`,
        };
      }
      setMeals(updated);
      setEditingIndex(null);
      setIsAdding(false);
    };

    const allItems = meals.flat();
    const totalMacros = {
      kcal: { value: allItems.reduce((sum, i) => sum + parseFloat(i.kcal), 0), goal: goals.kcal, color: "#3b82f6" },
      protein: { value: allItems.reduce((sum, i) => sum + parseFloat(i.protein), 0), goal: goals.protein, color: "#10b981" },
      carbs: { value: allItems.reduce((sum, i) => sum + parseFloat(i.carbs), 0), goal: goals.carbs, color: "#facc15" },
      fat: { value: allItems.reduce((sum, i) => sum + parseFloat(i.fat), 0), goal: goals.fat, color: "#ec4899" },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-600 text-white flex justify-center items-center p-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-6xl p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
              Nutrition Plan
            </h1>
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
                <div className="flex flex-col gap-4 w-full">
                  {Object.entries(totalMacros).map(([label, { value, goal, color }]) => {
                    const percent = Math.min((value / goal) * 100, 100).toFixed(1);
                    return (
                      <div key={label}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="capitalize">{label}</span>
                          <span>{value.toFixed(1)}/{goal} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-neutral-700 h-4">
                          <div
                            className="h-4 rounded transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              {meals.map((meal, mealIdx) => (
                <div key={mealIdx} className="bg-gradient-to-r from-neutral-800 to-neutral-900 p-4 rounded-xl border border-white/20 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Meal {mealIdx + 1}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData({ name: "", weight: "", kcal: "", protein: "", carbs: "", fat: "" });
                          setIsAdding(true);
                          setEditingIndex({ mealIdx, index: null });
                        }}
                        className="text-blue-400 text-sm hover:underline"
                      >
                        + Add Food
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...meals];
                          updated.splice(mealIdx, 1);
                          setMeals(updated);
                        }}
                        className="text-red-400 text-sm hover:underline"
                      >
                        Remove Meal
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 px-1 mb-1">
                    <span className="w-1/2">Item</span>
                    <span className="w-1/6 text-right">Kcal</span>
                    <span className="w-1/6 text-right">Protein</span>
                    <span className="w-1/6 text-right">Carbs</span>
                    <span className="w-1/6 text-right">Fat</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {meal.map((item, index) => (
                      <li key={index} className="flex justify-between border-b border-gray-700 pb-1">
                        <span className="w-1/2 flex items-center">
                          {item.name} <span className="ml-2 text-gray-400 text-xs">({item.weight}g)</span>
                          <span className="text-blue-400 text-xs cursor-pointer ml-2" onClick={() => {
                            setEditingIndex({ mealIdx, index });
                            setIsAdding(false);
                            setFormData(item);
                          }}>Edit</span>
                          <span className="text-red-400 text-xs cursor-pointer ml-2" onClick={() => {
                            const updated = [...meals];
                            updated[mealIdx].splice(index, 1);
                            setMeals(updated);
                          }}>Remove</span>
                        </span>
                        <span className="w-1/6 text-right">{item.kcal}</span>
                        <span className="w-1/6 text-right">{item.protein}</span>
                        <span className="w-1/6 text-right">{item.carbs}</span>
                        <span className="w-1/6 text-right">{item.fat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button
                onClick={handleAddMeal}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg transition duration-200 transform hover:scale-105 font-semibold"
              >
                + Add Meal
              </button>
            </div>
            {(editingIndex !== null || isAdding) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative bg-neutral-800 p-6 rounded-lg w-full max-w-md space-y-4 text-sm shadow-lg transition-all duration-300">
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingIndex(null);
                    }}
                    className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
                  >
                    ×
                  </button>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Name"
                        className="flex-1 p-2 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white border border-white/20 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                        required
                      />
                      <div className="flex gap-2 w-full md:w-auto">
                        <input
                          name="weight"
                          value={formData.weight}
                          onChange={handleFormChange}
                          placeholder="Weight"
                          className="w-full md:w-40 p-2 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white border border-white/20 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full text-center text-xs text-gray-400 mt-1 mb-1">
                      Macros per 100g of product
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["kcal", "protein", "carbs", "fat"].map((key) => (
                        <input
                          key={key}
                          name={key}
                          value={formData[key]}
                          onChange={handleFormChange}
                          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                          className="flex-1 p-2 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white border border-white/20 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                          required
                        />
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
                    >
                      {isAdding ? "Add" : "Update"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
    );
}