"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, AlertTriangle, Scan, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getScanHistory, ScanResult } from "@/utils/history";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-white/20 p-3 rounded-xl backdrop-blur-md shadow-2xl">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest">{new Date(label).toLocaleDateString()}</p>
                <p className="text-neon-blue font-bold text-lg">Score: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<ScanResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getScanHistory();
        setHistory(data);
        setLoading(false);
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                    <Scan className="w-10 h-10 text-neon-blue" />
                </div>
                <h2 className="text-2xl font-bold text-white">Secure Workspace</h2>
                <p className="text-gray-400 max-w-sm">Please sign in to view your patient dashboard and environmental trends.</p>
                <Link href="/login">
                    <Button glow className="px-8">Sign In</Button>
                </Link>
            </div>
        )
    }

    const chartData = [...history].reverse().map(item => ({
        timestamp: item.timestamp,
        risk: item.score
    }));

    const lastResult = history[0];
    const avgScore = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
        : 0;

    return (
        <main className="min-h-screen p-4 flex flex-col bg-gradient-to-b from-black to-gray-950 pb-20">
            <header className="flex items-center justify-between py-4 mb-8">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                </Link>
                <div className="text-sm font-medium text-neon-blue/80 tracking-widest uppercase">PathoScan Intelligence</div>
            </header>

            <div className="max-w-5xl mx-auto w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">System Overview</h1>
                        <p className="text-gray-400">Monitoring environmental pathogen levels for <span className="text-neon-blue font-medium">{user?.name}</span>.</p>
                    </div>
                    <Link href="/scan">
                        <Button glow className="gap-2">
                            <Scan className="w-4 h-4" /> New Acquisition
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-black/40 border-white/5 hover:border-neon-blue/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-neon-blue" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Global Status</p>
                                <p className={`text-xl font-bold ${avgScore < 30 ? 'text-green-400' : avgScore < 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {avgScore < 30 ? 'Stable' : avgScore < 60 ? 'Elevated' : 'Critical'}
                                </p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-neon-blue"
                                initial={{ width: 0 }}
                                animate={{ width: `${avgScore}%` }}
                            />
                        </div>
                    </Card>

                    <Card className="p-6 bg-black/40 border-white/5 hover:border-neon-purple/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-neon-purple" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Avg Risk Index</p>
                                <p className="text-xl font-bold text-white">{avgScore}<span className="text-sm text-gray-500 font-normal">/100</span></p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-neon-purple"
                                initial={{ width: 0 }}
                                animate={{ width: `${avgScore}%` }}
                            />
                        </div>
                    </Card>

                    <Card className="p-6 bg-black/40 border-white/5 hover:border-neon-pink/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-neon-pink/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-neon-pink" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Last Analysis</p>
                                <p className="text-xl font-bold text-white">
                                    {lastResult ? new Date(lastResult.timestamp).toLocaleDateString() : 'No data'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Next recommended retest: <span className="text-white">Tomorrow</span></p>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 p-6 md:p-8 bg-black/60 border-white/10 min-h-[450px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Acquisition Trend</h2>
                                <p className="text-sm text-gray-500">Historical microbial growth markers</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="timestamp"
                                            stroke="#444"
                                            tick={{ fill: '#444', fontSize: 10 }}
                                            tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis
                                            stroke="#444"
                                            tick={{ fill: '#444', fontSize: 10 }}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="risk"
                                            stroke="#00f3ff"
                                            strokeWidth={3}
                                            dot={{ fill: '#000', stroke: '#00f3ff', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, fill: '#00f3ff', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-600">
                                    <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Insufficient data to generate trend</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 bg-black/60 border-white/10 overflow-hidden">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Archives</h2>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                                        onClick={() => router.push(`/results?risk=${item.risk}&score=${item.score}&safeP=${item.percentages.safe}&warningP=${item.percentages.warning}&dangerP=${item.percentages.danger}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.risk === 'safe' ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.5)]' :
                                                    item.risk === 'warning' ? 'bg-neon-purple shadow-[0_0_8px_rgba(189,0,255,0.5)]' :
                                                        'bg-neon-pink shadow-[0_0_8px_rgba(255,0,85,0.5)]'
                                                }`} />
                                            <div>
                                                <p className="text-sm font-medium text-white">{new Date(item.timestamp).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.risk} detected</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-300 group-hover:text-neon-blue">{item.score}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-20 text-sm">Perform your first scan to start tracking history.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
