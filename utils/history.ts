"use client";

export interface ScanResult {
    id: string;
    timestamp: string;
    risk: "safe" | "warning" | "danger";
    score: number;
    percentages: {
        safe: number;
        warning: number;
        danger: number;
    };
    metadata?: Record<string, any>;
}

const STORAGE_KEY = "pathoscan_history";

export function getScanHistory(): ScanResult[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load history:", error);
        return [];
    }
}

export function saveScanResult(result: Omit<ScanResult, "id" | "timestamp">) {
    if (typeof window === "undefined") return;

    const history = getScanHistory();
    const newResult: ScanResult = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
    };

    const updatedHistory = [newResult, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newResult;
}

export function clearHistory() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
