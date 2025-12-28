"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    name: string;
    password?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => { success: boolean, message?: string };
    signup: (email: string, name: string, password?: string) => { success: boolean, message?: string };
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem("pathoscan_active_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const getUsers = (): User[] => {
        const stored = localStorage.getItem("pathoscan_users_db");
        return stored ? JSON.parse(stored) : [];
    };

    const login = (email: string, password?: string) => {
        const users = getUsers();
        const foundUser = users.find(u => u.email === email && (!password || u.password === password));

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("pathoscan_active_user", JSON.stringify(foundUser));
            return { success: true };
        }
        return { success: false, message: "Invalid email or password" };
    };

    const signup = (email: string, name: string, password?: string) => {
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: "User already exists" };
        }

        const newUser = { email, name, password };
        const updatedUsers = [...users, newUser];
        localStorage.setItem("pathoscan_users_db", JSON.stringify(updatedUsers));

        // Auto login
        setUser(newUser);
        localStorage.setItem("pathoscan_active_user", JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("pathoscan_active_user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
