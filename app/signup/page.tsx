"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = signup(email, name, password);
        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message || "Failed to create account");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 space-y-8 backdrop-blur-xl bg-slate-900/50 border-white/10 shadow-[0_0_50px_rgba(189,0,255,0.1)]">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Create Identity</h1>
                        <p className="text-gray-400">Join the beta to start environmental monitoring.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-[10px] items-center font-medium text-gray-400 uppercase tracking-widest">
                                Display Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-neon-purple hover:bg-neon-purple/80 text-white"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Initialize Profile"}
                        </Button>
                    </form>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500">
                            Already part of the network?{" "}
                            <Link href="/login" className="text-neon-purple hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
