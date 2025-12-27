"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";

export function UserNav() {
    const { user, logout } = useAuth();

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                </Link>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                    <User className="w-3 h-3" />
                    <span>{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-alert-red hover:bg-alert-red/10">
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <Link href="/login">
            <Button variant="primary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-none">
                Sign In
            </Button>
        </Link>
    );
}
