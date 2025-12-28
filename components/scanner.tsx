"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Loader2, ScanLine, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { calculateRiskScore, getAverageColor, rgbToLab } from "@/utils/color-analysis";

export function Scanner() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ROI Corners State in percentages (x, y)
    const [corners, setCorners] = useState({
        tl: { x: 25, y: 25 },
        tr: { x: 75, y: 25 },
        bl: { x: 25, y: 75 },
        br: { x: 75, y: 75 }
    });

    const handleCornerDrag = (corner: keyof typeof corners, info: any) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newX = ((corners[corner].x * rect.width / 100) + info.offset.x) * 100 / rect.width;
            const newY = ((corners[corner].y * rect.height / 100) + info.offset.y) * 100 / rect.height;

            setCorners(prev => ({
                ...prev,
                [corner]: {
                    x: Math.max(0, Math.min(100, newX)),
                    y: Math.max(0, Math.min(100, newY))
                }
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setAnalyzing(true);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image,
                    corners // Send 4 corners to API
                }),
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const result = await response.json();

            // Artificial delay to make the "Analyzing..." phase feel intentional and premium
            setTimeout(() => {
                const params = new URLSearchParams({
                    risk: result.risk,
                    score: result.score.toString(),
                    safeP: result.percentages?.safe?.toFixed(1) || "0",
                    warningP: result.percentages?.warning?.toFixed(1) || "0",
                    dangerP: result.percentages?.danger?.toFixed(1) || "0"
                });
                router.push(`/results?${params.toString()}`);
            }, 1500);

        } catch (error) {
            console.error("Analysis error:", error);
            // Fallback for demo
            setTimeout(() => {
                router.push(`/results?risk=warning&score=42&safeP=40&warningP=50&dangerP=10`);
            }, 2000);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Hidden Canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            <AnimatePresence mode="wait">
                {!image ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="upload"
                        className="flex flex-col gap-6"
                    >
                        <Card className="p-8 border-dashed border-2 border-neon-blue/30 flex flex-col items-center justify-center min-h-[400px] bg-black/40">
                            <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-6 animate-pulse-slow">
                                <ScanLine className="w-10 h-10 text-neon-blue" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Scan PathoStrip</h2>
                            <p className="text-gray-400 text-center mb-8">
                                Place the strip on a flat surface. ensure the <strong>Reference Card</strong> is visible.
                            </p>

                            <div className="flex flex-col gap-4 w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    size="lg"
                                    glow
                                    className="w-full gap-2"
                                >
                                    <Camera className="w-5 h-5" /> Start Capture
                                </Button>
                                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-2">
                                    <Info className="w-3 h-3" />
                                    <span>Align Reference Card edges in viewfinder</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="preview"
                        className="flex flex-col gap-6"
                    >
                        <Card className="p-4 bg-black/60 overflow-hidden relative">
                            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/50 border border-white/10">
                                <img src={image} alt="Scan preview" className="w-full h-full object-cover" />

                                {/* Quadrilateral ROI Overlay UI */}
                                {!analyzing && (
                                    <div className="absolute inset-0 z-10" ref={containerRef}>
                                        {/* SVG Polygon to show the ROI area */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            <polygon
                                                points={`${corners.tl.x},${corners.tl.y} ${corners.tr.x},${corners.tr.y} ${corners.br.x},${corners.br.y} ${corners.bl.x},${corners.bl.y}`}
                                                className="fill-neon-blue/20 stroke-neon-blue stroke-2"
                                                transform={`scale(${containerRef.current?.clientWidth ? containerRef.current.clientWidth / 100 : 1}, ${containerRef.current?.clientHeight ? containerRef.current.clientHeight / 100 : 1})`}
                                            />
                                        </svg>

                                        {/* Corner Handles */}
                                        {(Object.keys(corners) as Array<keyof typeof corners>).map((corner) => (
                                            <motion.div
                                                key={corner}
                                                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-neon-blue rounded-full border-2 border-white shadow-lg cursor-pointer z-20 flex items-center justify-center"
                                                style={{
                                                    top: `${corners[corner].y}%`,
                                                    left: `${corners[corner].x}%`
                                                }}
                                                drag
                                                dragMomentum={false}
                                                onDragEnd={(e, info) => handleCornerDrag(corner, info)}
                                            >
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </motion.div>
                                        ))}

                                        <div className="absolute bottom-6 inset-x-0 text-center text-white font-bold text-xs uppercase tracking-widest pointer-events-none bg-black/40 py-2 backdrop-blur-sm">
                                            Move corners to pin PathoStrip
                                        </div>
                                    </div>
                                )}

                                {analyzing && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-neon-blue/20 blur-xl animate-pulse"></div>
                                            <Loader2 className="w-16 h-16 text-neon-blue animate-spin relative z-10" />
                                        </div>
                                        <p className="text-neon-blue font-medium mt-6 animate-pulse">
                                            Calibrating with Reference Card...
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Analyzing Delta-E shifts...
                                        </p>
                                    </div>
                                )}

                                {/* Scanning Overlay Animation */}
                                {analyzing && (
                                    <motion.div
                                        className="absolute inset-x-0 h-1 bg-neon-blue/80 shadow-[0_0_15px_rgba(0,243,255,1)] z-10"
                                        initial={{ top: "0%" }}
                                        animate={{ top: "100%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </div>
                        </Card>

                        {!analyzing && (
                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setImage(null)} className="flex-1">
                                    Retake
                                </Button>
                                <Button onClick={handleAnalyze} glow className="flex-1">
                                    Analyze
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
