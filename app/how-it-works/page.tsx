"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScanLine, Smartphone, Activity, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
    {
        title: "1. Get Your PathoStrip",
        description: "Our specialized strips contain bio-reactive agents that change color in the presence of harmful microbial growth.",
        icon: <ScanLine className="w-8 h-8 text-medical-blue" />,
        color: "bg-medical-blue/10",
        border: "border-medical-blue/20"
    },
    {
        title: "2. Scan with App",
        description: "Use the PathoScan camera to capture the strip. Our 'Smart Capture' system uses the Reference Card to calibrate specifically for your lighting.",
        icon: <Smartphone className="w-8 h-8 text-warning-purple" />,
        color: "bg-warning-purple/10",
        border: "border-warning-purple/20"
    },
    {
        title: "3. AI Color Analysis",
        description: "We analyze the strip's color delta in the LAB color space to detect microscopic shifts invisible to the naked eye.",
        icon: <Activity className="w-8 h-8 text-alert-red" />,
        color: "bg-alert-red/10",
        border: "border-alert-red/20"
    },
    {
        title: "4. Actionable Results",
        description: "Receive an instant risk score and specific recommendations to secure your environment.",
        icon: <CheckCircle className="w-8 h-8 text-medical-green" />,
        color: "bg-medical-green/10",
        border: "border-medical-green/20"
    }
];

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen p-6 md:p-12 mb-20 max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Precision at your fingertips.
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    PathoScan turns your smartphone into a laboratory-grade contamination detector. Here's how the magic happens.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative">
                {/* Connection Line (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-medical-blue/50 via-warning-purple/50 to-alert-red/50 -translate-x-1/2" />

                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative ${index % 2 === 0 ? "md:text-right md:items-end" : "md:col-start-2"}`}
                    >
                        {/* Dot on line */}
                        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 p-1 bg-black rounded-full border border-white/20 z-10"
                            style={{ left: index % 2 === 0 ? 'calc(100% + 1rem + 1px)' : 'calc(0% - 1rem - 1px)' }}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>

                        <Card className={`p-6 hover:bg-white/5 transition-colors border ${step.border}`}>
                            <div className={`mb-4 inline-flex p-3 rounded-xl ${step.color} ${index % 2 === 0 ? "md:order-last md:ml-auto" : ""}`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <Link href="/scan">
                    <Button size="lg" className="bg-medical-blue hover:bg-medical-blue/80 text-white gap-2 text-lg px-8 h-12">
                        Start Scanning <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </main>
    );
}
