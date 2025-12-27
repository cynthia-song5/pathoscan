import { Scanner } from "@/components/scanner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
    return (
        <main className="min-h-screen p-4 flex flex-col">
            <header className="flex items-center justify-between py-4 mb-8">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                </Link>
                <div className="text-sm font-medium text-neon-blue/80 tracking-widest uppercase">PathoScan</div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center">
                <Scanner />
            </div>
        </main>
    );
}
