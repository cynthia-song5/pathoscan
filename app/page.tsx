"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Scan, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/20 blur-[120px] rounded-full animate-pulse-slow" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-medium mb-4 backdrop-blur-md">
            The Future of Home Health Safety
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Invisible Threats. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow-blue">
              Visible Solutions.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Pathogens hide in the air you breathe. PathoScan makes them visible before they become dangerous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/scan">
              <Button size="lg" glow className="gap-2">
                <Scan className="w-5 h-5" /> Start Scanning
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="gap-2">
              How it works <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="w-full py-24 px-4 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What you can&apos;t see <span className="text-neon-pink">can hurt you.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Nearly 100,000 patients die every year from hospital-acquired infections. But the danger follows people home. Hidden mold, airborne spores, and bacterial growth put your loved ones at risk without warning.
              </p>
              <div className="p-6 border-l-4 border-neon-pink bg-neon-pink/5 rounded-r-xl">
                <p className="text-white italic">
                  &quot;A visible indicator would be incredibly useful — showing before problems grow.&quot;
                </p>
                <p className="text-neon-pink mt-2 font-medium">— NASA Expert</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6 hover:bg-white/5 transition-colors">
                <AlertTriangle className="w-8 h-8 text-neon-pink mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Silent Spread</h3>
                <p className="text-gray-400">Contaminants slip through vents and settle on surfaces, invisible to the naked eye.</p>
              </Card>
              <Card className="p-6 hover:bg-white/5 transition-colors">
                <ShieldAlert className="w-8 h-8 text-neon-purple mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Late Detection</h3>
                <p className="text-gray-400">By the time you smell mold or see growth, it&apos;s often too late to prevent exposure.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="w-full py-24 px-4 relative">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Collect. <span className="text-neon-blue">Detect.</span> Protect.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our two-in-one solution transforms complex lab testing into specific, actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Blue State */}
          <Card variant="strong" className="p-8 flex flex-col items-center text-center border-t-4 border-t-neon-blue" hoverEffect>
            <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
              <ShieldCheck className="w-8 h-8 text-neon-blue" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">All Clear</h3>
            <p className="text-neon-blue font-medium mb-4">Blue Indicator</p>
            <p className="text-gray-400">
              No significant contamination detected. Your environment is safe for recovery.
            </p>
          </Card>

          {/* Purple State */}
          <Card variant="strong" className="p-8 flex flex-col items-center text-center border-t-4 border-t-neon-purple" hoverEffect>
            <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(189,0,255,0.3)]">
              <AlertTriangle className="w-8 h-8 text-neon-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Early Warning</h3>
            <p className="text-neon-purple font-medium mb-4">Purple Indicator</p>
            <p className="text-gray-400">
              Elevated microbial activity detected. Improved ventilation recommended.
            </p>
          </Card>

          {/* Pink State */}
          <Card variant="strong" className="p-8 flex flex-col items-center text-center border-t-4 border-t-neon-pink" hoverEffect>
            <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,85,0.3)]">
              <ShieldAlert className="w-8 h-8 text-neon-pink" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Action Required</h3>
            <p className="text-neon-pink font-medium mb-4">Pink Indicator</p>
            <p className="text-gray-400">
              Dangerous levels of contamination. Immediate cleaning and isolation advised.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to verify your safety?</h2>
          <p className="text-gray-400 text-lg">
            Join the beta and start protecting your home today.
          </p>
          <Link href="/scan">
            <Button size="lg" variant="secondary" glow className="px-12">
              Order PathoStrip Kit
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
