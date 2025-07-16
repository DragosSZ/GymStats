// src/components/Layout.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
    const { isLoggedIn, isTrainer } = useContext(AuthContext);
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}