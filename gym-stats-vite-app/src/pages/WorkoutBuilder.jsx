import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function WorkoutBuilder() {
  const [entries, setEntries] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterDays, setFilterDays] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('workoutEntries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      date,
      exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight)
    };
    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = entry;
      setEntries(updated);
      setEditingIndex(null);
    } else {
      setEntries([...entries, entry]);
    }
    setDate(today);
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

  const now = new Date();
  const filteredEntries = sortedEntries.filter(entry => {
    if (filterDays === 0) return true;
    const entryDate = new Date(entry.date);
    const diffTime = now - entryDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= filterDays;
  });

  // Aggregate total workout volume per date for the chart
  const volumeByDate = {};
  filteredEntries.forEach(e => {
    const volume = e.sets * e.reps * e.weight;
    if (e.date in volumeByDate) {
      volumeByDate[e.date] += volume;
    } else {
      volumeByDate[e.date] = volume;
    }
  });

  const data = {
    labels: Object.keys(volumeByDate),
    datasets: [
      {
        label: 'Total Volume (kg)',
        data: Object.values(volumeByDate),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-600 text-white flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-6xl p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">Workout Tracker</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-6 rounded-xl shadow-xl ring-1 ring-white/10">
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col items-center">
              <label className="block mb-1 text-sm font-semibold text-white">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="block mb-1 text-sm font-semibold text-white">Exercise</label>
              <input
                type="text"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                placeholder="e.g. Squat"
                required
                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col items-center">
              <label className="block mb-1 text-sm font-semibold text-white">Sets</label>
              <div className="flex items-center gap-2 justify-center">
                <button type="button" onClick={() => setSets(s => Math.max(0, parseInt(s || 0) - 1))} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">−</button>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-20 p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-center appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-lg"
                />
                <button type="button" onClick={() => setSets(s => parseInt(s || 0) + 1)} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">+</button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="block mb-1 text-sm font-semibold text-white">Reps</label>
              <div className="flex items-center gap-2 justify-center">
                <button type="button" onClick={() => setReps(r => Math.max(0, parseInt(r || 0) - 2))} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">−</button>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-20 p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-center appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-lg"
                />
                <button type="button" onClick={() => setReps(r => (parseInt(r || 0) + 2))} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">+</button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="block mb-1 text-sm font-semibold text-white">Weight (kg)</label>
              <div className="flex items-center gap-2 justify-center">
                <button type="button" onClick={() => setWeight(w => Math.max(0, parseFloat(w || 0) - 1))} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">−</button>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-20 p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-center appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-lg"
                />
                <button type="button" onClick={() => setWeight(w => parseFloat(w || 0) + 1)} className="text-xl bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow transition">+</button>
              </div>
            </div>
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-xl ring-1 ring-white/10 transition duration-200 transform hover:scale-102 font-semibold">
            {editingIndex !== null ? 'Update Entry' : 'Add Entry'}
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          {[0, 7, 30, 60, 90, 120, 180, 365].map(days => (
            <button
              key={days}
              onClick={() => setFilterDays(days)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                filterDays === days
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white'
              }`}
            >
              {days === 0 ? 'All' : days <= 90 ? `${days} Days` : `${Math.round(days / 30)} Months`}
            </button>
          ))}
        </div>

        <div className="resize overflow-auto bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-4 rounded-xl shadow-md ring-1 ring-white/10 min-h-[435px] max-h-[80vh] w-[90%] max-w-[calc(100%-2rem)] min-w-[300px] mx-auto">
          <div className="h-[400px]">
            <Line data={data} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  },
                  ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Volume (kg)'
                  },
                  beginAtZero: true
                }
              }
            }} />
          </div>
        </div>

        <ul className="mt-6 space-y-2 divide-y divide-neutral-700">
          {filteredEntries.map((entry, index) => (
            <li key={index} className="flex flex-col bg-gradient-to-r from-neutral-800/80 to-neutral-900/80 p-3 rounded-xl ring-1 ring-white/10 shadow hover:bg-neutral-700/40 transition">
              <div className="flex justify-between items-center">
                <span>{entry.date} - {entry.exercise} ({entry.sets}x{entry.reps} @ {entry.weight}kg)</span>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => {
                    setEditingIndex(index);
                    setDate(entry.date);
                    setExercise(entry.exercise);
                    setSets(entry.sets.toString());
                    setReps(entry.reps.toString());
                    setWeight(entry.weight.toString());
                  }} className="text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => {
                    const updated = filteredEntries.filter((_, i) => i !== index);
                    setEntries(updated);
                  }} className="text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}