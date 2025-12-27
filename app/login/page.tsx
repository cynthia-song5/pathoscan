"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            login(email || "patient@pathoscan.com");
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 space-y-8 backdrop-blur-xl bg-slate-900/50 border-white/10">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to view your contamination trends.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-medical-blue/50 transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-medical-blue hover:bg-medical-blue/80 text-white"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In to Dashboard"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full border border-white/10 text-gray-400 hover:text-white">
                        Use Demo Account
                    </Button>
                </Card>
            </motion.div>
        </div>
    );
}
