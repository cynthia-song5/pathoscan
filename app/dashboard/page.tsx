"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock Data for last 30 days
const data = [
    { day: "1", risk: 5 },
    { day: "5", risk: 8 },
    { day: "10", risk: 12 },
    { day: "15", risk: 15 },
    { day: "20", risk: 45 }, // Spike
    { day: "25", risk: 55 }, // Warning
    { day: "30", risk: 85 }, // Danger
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 border border-white/20 p-3 rounded-lg backdrop-blur-md">
                <p className="text-gray-300 text-sm mb-1">Day {label}</p>
                <p className="text-medical-blue font-bold">Risk Score: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    // Add this to your DashboardPage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.is_blurry) {
                alert("Image is too blurry. Please stabilize your camera.");
                return;
            }

            // Use the 'pink' percentage as the risk score
            const newRiskScore = result.percentages.pink;
            console.log("New Risk Score Detected:", newRiskScore);

            // Update your chart data here (assuming you move 'data' to a useState)
        } catch (error) {
            console.error("Connection to PathoScan API failed", error);
        }
    };

    useEffect(() => {
        // Simple client-side protection for MVP
        if (!isAuthenticated) {
            // Allow a brief moment for hydration check in a real app, 
            // but for now immediate redirect is fine with the simple context
            // router.push("/login"); 

            // Actually, let's just show a specific "Access Denied" state or redirect
            // Ideally checking loading state. For this MVP, we'll assume fast boolean check.
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
                <p className="text-gray-400">Please sign in to view your patient dashboard.</p>
                <Link href="/login">
                    <Button variant="primary">Go to Login</Button>
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen p-4 flex flex-col">
            <header className="flex items-center justify-between py-4 mb-8">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                </Link>
                <div className="text-sm font-medium text-medical-blue/80 tracking-widest uppercase">PathoScan Intelligence</div>
            </header>

            <div className="max-w-4xl mx-auto w-full space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
                    <p className="text-gray-400">Monitoring microbial growth trends for your environment.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-medical-blue/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-medical-blue" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Current Status</p>
                                <p className="text-xl font-bold text-white">Rising</p>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-medical-blue w-[70%]" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-warning-purple/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-warning-purple" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Avg Risk Score</p>
                                <p className="text-xl font-bold text-white">42/100</p>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-warning-purple w-[42%]" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-alert-red/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-alert-red" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Next Scan</p>
                                <p className="text-xl font-bold text-white">Tomorrow</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-2 text-alert-red hover:bg-alert-red/10">
                            Set Reminder
                        </Button>
                    </Card>
                </div>

                <Card className="p-6 md:p-8 min-h-[400px]">
                    <h2 className="text-xl font-semibold text-white mb-6">30-Day Risk Analysis</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#888"
                                    tick={{ fill: '#888' }}
                                    label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }}
                                />
                                <YAxis
                                    stroke="#888"
                                    tick={{ fill: '#888' }}
                                    domain={[0, 100]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    dot={{ fill: '#0f172a', stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 8, fill: '#0ea5e9' }}
                                />
                                {/* Threshold Line */}
                                <Line
                                    type="monotone"
                                    dataKey={() => 80}
                                    stroke="#ef4444"
                                    strokeDasharray="5 5"
                                    strokeWidth={1}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-medical-blue" />
                            <span className="text-gray-400">Your Levels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-alert-red" />
                            <span className="text-gray-400">Danger Threshold</span>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}
