import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ProgressTracker() {
  const [entries, setEntries] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState('');
  const [photos, setPhotos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterDays, setFilterDays] = useState(0);
  const [zoomPhoto, setZoomPhoto] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/progress", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched entries:", data.entries);
        setEntries(data.entries || []);  // Important fallback
      } else {
        console.error("Failed to fetch progress data.");
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const images = photos.length > 0 && photos[0] instanceof File
      ? await Promise.all(photos.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        }))
      : [];

    const payload = {
      weight: parseFloat(weight),
      height: 0,
      pictureUrls: images,
      date: new Date(date)
    };

    const res = await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await fetch("http://localhost:5000/api/progress", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await updated.json();
      setEntries(data.entries);
      setWeight('');
      setPhotos([]);
      setDate(today);
      setEditingIndex(null);
    } else {
      console.error("Failed to submit progress entry");
    }
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

  const data = {
    labels: filteredEntries.map(e =>
      new Date(e.date).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: filteredEntries.map(e => e.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
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
          text: 'Weight (kg)'
        },
        min: 10,
        max: 100,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-600 text-white flex items-center justify-center px-6 pt-12 pb-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg w-full max-w-6xl p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
          Progress Tracker
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-6 rounded-xl shadow-xl ring-1 ring-white/10">
          <div>
            <label className="block mb-1 text-sm">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              required
              className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Photos (optional, up to 6)</label>
            <label className="block w-full cursor-pointer">
              <div className="w-fit px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md ring-1 ring-white/10 hover:from-blue-600 hover:to-purple-700 transition">
                Choose Photos (Max 6)
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.files).slice(0, 6);
                  setPhotos(selected);
                }}
                className="hidden"
              />
            </label>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((file, i) => {
                  const src = file instanceof File ? URL.createObjectURL(file) : file;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-xl ring-1 ring-white/10 transition duration-200 transform hover:scale-105 font-semibold"
          >
            {editingIndex !== null ? 'Update Entry' : 'Add Entry'}
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          {[0, 30, 60, 90, 120, 180, 365].map(days => (
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

        <div className="relative w-full flex justify-center">
          <div className="resize overflow-auto bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-4 rounded-xl shadow-md ring-1 ring-white/10 min-h-[435px] max-h-[80vh] w-[90%] max-w-[calc(100%-2rem)] min-w-[300px] mx-auto">
            <div className="h-[400px]">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {entries.map((entry, index) => (
            <li key={index} className="flex flex-col bg-neutral-800 p-2 rounded">
              <div className="flex justify-between items-center">
                <span>{new Date(entry.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} - {entry.weight} kg</span>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => {
                    setEditingIndex(index);
                    setWeight(entry.weight);
                    setDate(entry.date.slice(0, 10));
                    setPhotos(entry.photos || []);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} className="text-blue-400 hover:underline">Edit</button>
                  <button
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        const id = entry.id;

                        const res = await fetch(`http://localhost:5000/api/progress/${id}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        });

                        if (res.ok) {
                          const updated = entries.filter((_, i) => i !== index);
                          setEntries(updated);
                        } else {
                          console.error("Failed to delete entry");
                        }
                      }}
                      className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {entry.photos?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.photos.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Check-in"
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                      onClick={() => setZoomPhoto(img)}
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {zoomPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative">
              <button
                onClick={() => setZoomPhoto(null)}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                ×
              </button>
              <img src={zoomPhoto} alt="Zoom" className="max-w-full max-h-[90vh] rounded" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}