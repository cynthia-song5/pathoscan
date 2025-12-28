import { Scanner } from "@/components/scanner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
    return (
        <main className="min-h-[calc(100vh-80px)] p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg">
                <Scanner />
            </div>
        </main>
    );
}
