"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, ShieldAlert, RotateCcw, Download, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";

function ResultsContent() {
    const searchParams = useSearchParams();
    const risk = searchParams.get("risk") || "safe";

    const content = {
        safe: {
            color: "neon-blue",
            icon: ShieldCheck,
            title: "All Clear",
            subtitle: "No significant contamination detected.",
            bg: "bg-neon-blue/10",
            border: "border-neon-blue",
            glow: "shadow-[0_0_50px_rgba(0,243,255,0.2)]",
            description: "PathoStrip remains blue, indicating a safe environment. Microbial activity is within normal household levels.",
            actions: [
                "Continue regular cleaning schedule.",
                "Rescan in 2 weeks or if environmental conditions change.",
                "Maintain current ventilation settings."
            ]
        },
        warning: {
            color: "neon-purple",
            icon: AlertTriangle,
            title: "Warning",
            subtitle: "Elevated microbial activity detected.",
            bg: "bg-neon-purple/10",
            border: "border-neon-purple",
            glow: "shadow-[0_0_50px_rgba(189,0,255,0.2)]",
            description: "PathoStrip has shifted to purple. This indicates growing bacterial or fungal colonies that require attention.",
            actions: [
                "Inspect area for moisture or leaks.",
                "Increase ventilation immediately.",
                "Clean surfaces with EPA-registered disinfectant.",
                "Rescan in 48 hours to monitor progress."
            ]
        },
        danger: {
            color: "neon-pink",
            icon: ShieldAlert,
            title: "Danger",
            subtitle: "Hazardous contamination levels.",
            bg: "bg-neon-pink/10",
            border: "border-neon-pink",
            glow: "shadow-[0_0_50px_rgba(255,0,85,0.2)]",
            description: "PathoStrip has turned pink. Significant pathogen growth detected. This may pose a health risk to immunocompromised individuals.",
            actions: [
                "Isolate the area immediately.",
                "Wear protective gear (N95 mask, gloves) before entering.",
                "Contact professional remediation services.",
                "Do not use simple fans; they may spread spores."
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

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{state.title}</h1>
                    <p className={`text-xl font-medium text-${state.color} mb-6 uppercase tracking-wider`}>
                        {risk} Levels Detected
                    </p>

                    <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                        {state.description}
                    </p>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <h3 className="text-xl font-semibold text-white ml-2">Recommended Actions</h3>
                <Card className="p-0 overflow-hidden divide-y divide-white/10">
                    {state.actions.map((action, i) => (
                        <div key={i} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                            <div className={`mt-1 min-w-6 h-6 rounded-full border border-${state.color} flex items-center justify-center text-${state.color} text-xs font-bold`}>
                                {i + 1}
                            </div>
                            <p className="text-gray-300">{action}</p>
                        </div>
                    ))}
                </Card>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/scan" className="flex-1">
                    <Button size="lg" variant="ghost" className="w-full gap-2 border border-white/10">
                        <RotateCcw className="w-5 h-5" /> Scan Again
                    </Button>
                </Link>
                <Button size="lg" className="flex-1 gap-2" glow>
                    <Download className="w-5 h-5" /> Save Report
                </Button>
            </div>

            <div className="flex justify-center pt-8">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white gap-2">
                        <Home className="w-4 h-4" /> Return Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <main className="min-h-screen p-4 py-8">
            <Suspense fallback={<div className="text-white text-center mt-20">Loading results...</div>}>
                <ResultsContent />
            </Suspense>
        </main>
    );
}
