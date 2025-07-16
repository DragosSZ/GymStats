import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Programs from '../pages/Programs';
import Trainer from '../pages/Trainer';
import Account from '../pages/Account';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SignUp from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import MealPlanning from "../pages/MealPlanning.jsx";
import ProgressTracker from "../pages/ProgressTracker.jsx";
import Clients from "../pages/Clients.jsx";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import WorkoutBuilder from "../pages/WorkoutBuilder.jsx";

export default function AppRouter() {
    const { isLoggedIn, isTrainer } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/programs" element={<Programs />} />
            <Route
              path="/trainer"
              element={isLoggedIn && !isTrainer ? <Trainer /> : <Navigate to="/" replace />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/meal-planning" element={<MealPlanning />} />
            <Route path="/progress-tracker" element={<ProgressTracker />} />
            <Route
              path="/account"
              element={isLoggedIn ? <Account /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/clients"
              element={isLoggedIn && isTrainer ? <Clients /> : <Navigate to="/" replace />}
            />
            <Route path="/workout-builder" element={<WorkoutBuilder />} />
        </Routes>
    );
}