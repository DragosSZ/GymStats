export default function Footer() {
    return (
        <footer className="bg-black backdrop-blur-md w-full px-6 py-8 text-gray-400">
            <div className="bg-gradient-to-br from-neutral-900/80 to-black/70 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 max-w-6xl mx-auto">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 items-start">
                <div>
                    <h2 className="text-white font-extrabold text-2xl mb-4">Gym Stats</h2>
                    <p className="text-sm mb-4">Your ultimate fitness companion. Track, plan, and improve every day.</p>
                    <div className="flex gap-4 text-xl">
                        <a href="#" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 text-white hover:text-blue-500 transition" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.002 3.657 9.13 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.89h-2.33V22C18.343 21.13 22 17.002 22 12z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" className="w-6 h-6 text-white hover:text-pink-500 transition">
                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9-51.3-114.9-114.9-114.9zm0 186.6c-39.6 0-71.7-32.1-71.7-71.7s32.1-71.7 71.7-71.7 71.7 32.1 71.7 71.7-32.1 71.7-71.7 71.7zm146.4-194.3c0 14.9-12.1 27-27 27s-27-12.1-27-27 12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.5S391.8 7.6 356.1 5.9C320.8 4.2 127.2 4.2 91.9 5.9 56.2 7.6 24.6 15.8-1.7 42.1-28 68.4-36.2 100-37.9 135.7-39.6 171 39.6 340.2 91.9 366.5c26.3 13.2 57.9 21.4 93.6 23.1 35.3 1.7 228.9 1.7 264.2 0 35.7-1.7 67.3-9.9 93.6-36.2s34.5-57.9 36.2-93.6c1.7-35.3 1.7-228.9 0-264.2zM398.8 388c-7.8 19.6-23.4 35.2-43 43s-45.2 6.6-137.7 6.6-129.9-.1-137.7-6.6c-19.6-7.8-35.2-23.4-43-43-6.6-19.6-6.6-45.2-6.6-137.7s.1-129.9 6.6-137.7c7.8-19.6 23.4-35.2 43-43 19.6-6.6 45.2-6.6 137.7-6.6s129.9.1 137.7 6.6c19.6 7.8 35.2 23.4 43 43 6.6 19.6 6.6 45.2 6.6 137.7s-.1 129.9-6.6 137.7z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in text-white hover:text-blue-300 transition text-xl" />
                        </a>
                        <a href="#" aria-label="YouTube">
                            <i className="fab fa-youtube text-white hover:text-red-500 transition text-xl" />
                        </a>
                    </div>
                </div>
                <div className="md:col-span-3 flex justify-end gap-16">
                    <div>
                        <h3 className="font-semibold text-white mb-2">Product</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Download</a></li>
                            <li><a href="#">Updates</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Support</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Company</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
            <div className="mt-10 border-t border-white/10 pt-6 text-sm text-center text-gray-400">
                &copy; {new Date().getFullYear()} Gym Stats. All rights reserved.
            </div>
        </footer>
    );
}