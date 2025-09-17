import React from "react";
import edvironLogo from "../assets/images/edviron.png";
    function Home() {
        return (
            <div className="bg-white text-gray-900">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-4xl">
                    <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                Empowering Education with <span className="text-yellow-300">Edviron</span>
                            </h1>
                            <p className="mt-6 text-lg md:text-xl text-gray-100">
                                Transforming schools and institutions with powerful digital solutions.
                                Manage, grow, and succeed — all in one platform.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-300">
                                    Get Started
                                </button>
                                <button className="px-6 py-3 bg-white/20 border border-white text-white font-semibold rounded-lg hover:bg-white/30">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <img
                                src={edvironLogo}
                                alt="Edviron Illustration"
                                className="w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Edviron?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Smart Administration",
                                desc: "Automate school operations with ease and transparency.",
                                icon: "📊",
                            },
                            {
                                title: "Student-Centric",
                                desc: "Track student growth, academics, and attendance seamlessly.",
                                icon: "🎓",
                            },
                            {
                                title: "Seamless Payments",
                                desc: "Integrate secure fee payments with multiple gateways.",
                                icon: "💳",
                            },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="p-8 bg-white rounded-2xl shadow-2xl border hover:shadow-xl transition"
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-gray-50 py-20 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">About Edviron</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Edviron is revolutionizing the way schools operate by providing a
                            one-stop digital ecosystem. From fee management to learning tools,
                            Edviron ensures a future-ready education system for every child and
                            every institution.
                        </p>
                    </div>
                </section>

                {/* Testimonials / Stats */}
                <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-4xl font-bold text-indigo-600">500+</h3>
                        <p className="mt-2 text-gray-700">Schools Empowered</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-indigo-600">1M+</h3>
                        <p className="mt-2 text-gray-700">Students Impacted</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-indigo-600">99%</h3>
                        <p className="mt-2 text-gray-700">Client Satisfaction</p>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 rounded-3xl">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h2>
                        <p className="mb-8 text-lg">
                            Join the Edviron revolution and digitize your school today.
                        </p>
                        <button className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-300">
                            Get Started Now
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-8 rounded-3xl">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                        <p>© {new Date().getFullYear()} Edviron. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                            <a href="#" className="hover:text-white">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

export default Home;
