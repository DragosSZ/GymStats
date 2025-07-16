import { useEffect } from 'react';

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-purple-600 text-gray-300 pb-16">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-lg shadow-lg w-full max-w-6xl mx-auto px-4 md:px-12 mt-20">
                <div className="w-full px-8 md:px-16 pt-16">
                    <h1 className="text-5xl font-extrabold text-white mb-4">About</h1>
                    <p className="text-xl font-semibold mb-2">We are IronCode</p>
                    <p className="mb-8">
                        We are a group of passionate gym-goers who came up with the idea of a website to help other gym bros and people who are new to the gym with tracking their progress and getting in contact with their trainers. They can get all the custom food and diet information, as well as training programs, from their personal trainers through our app. This simplifies the process by streamlining the interaction between the trainee and the trainer.
                    </p>
                    <p className="mb-12">We hope you’ll enjoy our app and look forward to your feedback!</p>

                    <h2 className="text-2xl font-bold mb-4 text-white">Contact us</h2>
                    <form className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">First name</label>
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Last name</label>
                            <input
                                type="text"
                                placeholder="Surname"
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Email address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Your message</label>
                            <textarea
                                placeholder="Your message"
                                rows={4}
                                className="w-full p-3 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition duration-200 transform hover:scale-102 shadow-xl ring-1 ring-white/10"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}