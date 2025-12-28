"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, ShieldAlert, RotateCcw, Download, Home, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useState } from "react";
import { saveScanResult } from "@/utils/history";

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    const risk = searchParams.get("risk") || "safe";
    const score = parseInt(searchParams.get("score") || "0");
    const safeP = parseFloat(searchParams.get("safeP") || "0");
    const warningP = parseFloat(searchParams.get("warningP") || "0");
    const dangerP = parseFloat(searchParams.get("dangerP") || "0");

    const handleSave = () => {
        saveScanResult({
            risk: risk as "safe" | "warning" | "danger",
            score,
            percentages: {
                safe: safeP,
                warning: warningP,
                danger: dangerP
            }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const content = {
        safe: {
            color: "neon-blue",
            icon: ShieldCheck,
            title: "Safe",
            subtitle: "All Clear!",
            bg: "bg-neon-blue/10",
            border: "border-neon-blue",
            glow: "shadow-[0_0_50px_rgba(0,243,255,0.2)]",
            description: "No significant pathogen contamination detected. Your environment appears safe.",
            actions: [
                "Continue regular cleaning schedule.",
                "Rescan if conditions change.",
                "Maintain proper ventilation."
            ]
        },
        warning: {
            color: "neon-purple",
            icon: AlertTriangle,
            title: "Warning",
            subtitle: "Elevated Levels",
            bg: "bg-neon-purple/10",
            border: "border-neon-purple",
            glow: "shadow-[0_0_50px_rgba(189,0,255,0.2)]",
            description: "Some microbial activity detected. Localized cleaning is recommended.",
            actions: [
                "Inspect the area for moisture.",
                "Disinfect affected surfaces.",
                "Rescan in 24-48 hours."
            ]
        },
        danger: {
            color: "neon-pink",
            icon: ShieldAlert,
            title: "Danger",
            subtitle: "Hazardous Condition",
            bg: "bg-neon-pink/10",
            border: "border-neon-pink",
            glow: "shadow-[0_0_50px_rgba(255,0,85,0.2)]",
            description: "High pathogen levels detected. Urgent intervention required.",
            actions: [
                "Isolate the area immediately.",
                "Wear protective gear (N95+).",
                "Contact professional remediation."
            ]
        }
    };

    const state = content[risk as keyof typeof content] || content.safe;
    const Icon = state.icon;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 pb-20">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                <Card variant="strong" className={`p-8 md:p-12 text-center border-t-8 ${state.border} ${state.glow}`}>
                    <div className={`w-24 h-24 mx-auto rounded-full ${state.bg} flex items-center justify-center mb-6`}>
                        <Icon className={`w-12 h-12 text-${state.color}`} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{state.subtitle}</h1>
                    <p className={`text-xl font-medium text-${state.color} mb-8 uppercase tracking-wider`}>
                        Risk Score: {score}/100
                    </p>

                    {/* Color Percentage Breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-8">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-2 bg-neon-blue/20 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-neon-blue"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${safeP}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <span className="text-[10px] text-neon-blue font-bold uppercase tracking-tighter">Safe</span>
                            <span className="text-xl font-bold text-white">{safeP.toFixed(0)}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-full h-2 bg-neon-purple/20 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-neon-purple"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${warningP}%` }}
                                    transition={{ duration: 1, delay: 0.7 }}
                                />
                            </div>
                            <span className="text-[10px] text-neon-purple font-bold uppercase tracking-tighter">Warning</span>
                            <span className="text-xl font-bold text-white">{warningP.toFixed(0)}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-full h-2 bg-neon-pink/20 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-neon-pink"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dangerP}%` }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                />
                            </div>
                            <span className="text-[10px] text-neon-pink font-bold uppercase tracking-tighter">Danger</span>
                            <span className="text-xl font-bold text-white">{dangerP.toFixed(0)}%</span>
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto italic font-light">
                        "{state.description}"
                    </p>
                </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-4 ml-2">Recommended Actions</h3>
                    <Card className="p-0 overflow-hidden divide-y divide-white/10 bg-black/40 border-white/5">
                        {state.actions.map((action, i) => (
                            <div key={i} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                                <div className={`mt-1 min-w-6 h-6 rounded-full border border-${state.color} flex items-center justify-center text-${state.color} text-xs font-bold`}>
                                    {i + 1}
                                </div>
                                <p className="text-gray-300 text-sm">{action}</p>
                            </div>
                        ))}
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-4"
                >
                    <h3 className="text-xl font-semibold text-white mb-4 ml-2">Next Steps</h3>
                    <div className="flex flex-col gap-3">
                        <Link href="/scan" className="w-full">
                            <Button size="lg" variant="ghost" className="w-full gap-2 border border-white/10 h-14">
                                <RotateCcw className="w-5 h-5" /> Retest Area
                            </Button>
                        </Link>

                        <Button
                            size="lg"
                            className={`w-full gap-2 h-14 transition-all ${isSaved ? 'bg-green-500 hover:bg-green-600 border-green-400' : ''}`}
                            glow={!isSaved}
                            onClick={handleSave}
                            disabled={isSaved}
                        >
                            <AnimatePresence mode="wait">
                                {isSaved ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" /> Report Saved
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="save"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> Save to History
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>

                        <Link href="/dashboard" className="w-full">
                            <Button variant="ghost" className="w-full gap-2 text-gray-400 hover:text-white border-transparent">
                                <Home className="w-4 h-4" /> Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <main className="min-h-screen p-4 py-8 bg-gradient-to-b from-black to-gray-950">
            <Suspense fallback={<div className="text-white text-center mt-20">Analysing results...</div>}>
                <ResultsContent />
            </Suspense>
        </main>
    );
}
