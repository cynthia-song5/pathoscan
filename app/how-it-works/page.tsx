"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scan, Cpu, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        {
            icon: Scan,
            title: "1. Capture",
            description: "Place your PathoStrip in an area of concern. After 24 hours, use the app to take a high-resolution photo of the strip.",
            color: "neon-blue"
        },
        {
            icon: Cpu,
            title: "2. Analyze",
            description: "Our proprietary Computer Vision pipeline extracts the color data from your strip, correcting for lighting and perspective.",
            color: "neon-purple"
        },
        {
            icon: BarChart3,
            title: "3. Monitor",
            description: "Track contamination levels over time. Identify trends and get specific recommendations based on localized risk scores.",
            color: "neon-pink"
        }
    ];

    return (
        <main className="min-h-screen p-4 py-12 bg-gradient-to-b from-black to-gray-950">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </Link>
                    <div className="text-sm font-medium text-neon-blue/80 tracking-widest uppercase italic">The PathoScan System</div>
                </header>

                <div className="text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                    >
                        How <span className="text-neon-blue">PathoScan</span> Works
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Scientific-grade environmental monitoring, simplified for your home.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card className="p-8 h-full bg-black/40 border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${step.color}/5 blur-3xl -mr-12 -mt-12 group-hover:bg-${step.color}/10 transition-colors`} />
                                <step.icon className={`w-10 h-10 text-${step.color} mb-6`} />
                                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <section className="space-y-8 pt-12">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <h2 className="text-2xl font-bold text-white px-4">Deep Science</h2>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-8 bg-black/60 border-white/10">
                            <h3 className="text-neon-blue font-bold mb-4 uppercase tracking-widest text-xs">Computer Vision</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Our pipeline uses **Perspective Transformation** to flatten the strip image, ensuring accurate measurement regardless of camera angle. We apply **Adaptive White Balance** to normalize for indoor lighting (warm LED vs natural light).
                            </p>
                        </Card>
                        <Card className="p-8 bg-black/60 border-white/10">
                            <h3 className="text-neon-pink font-bold mb-4 uppercase tracking-widest text-xs">Intelligence Engine</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                By quantifying the ratio of microbial markers (safe blue to hazardous pink), we calculate a **Risk Index**. This index is trended over time to predict potential outbreaks before they become visible.
                            </p>
                        </Card>
                    </div>
                </section>

                <div className="flex justify-center pt-12">
                    <Link href="/scan">
                        <Button size="lg" glow className="px-12 gap-2">
                            Try It Yourself <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
