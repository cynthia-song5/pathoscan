"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {

        const variants = {
            primary: "bg-neon-blue text-black font-semibold hover:bg-white hover:text-black",
            secondary: "bg-neon-purple text-white font-semibold hover:bg-white hover:text-black",
            danger: "bg-neon-pink text-white font-semibold hover:bg-white hover:text-black",
            ghost: "bg-transparent text-foreground hover:bg-glass hover:text-neon-blue",
            outline: "bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        const glowStyles = glow ? "shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)]" : "";
        const dangerGlow = (glow && variant === 'danger') ? "shadow-[0_0_20px_rgba(255,0,85,0.5)] hover:shadow-[0_0_30px_rgba(255,0,85,0.8)]" : "";

        // Override glow if danger
        const finalGlow = variant === 'danger' ? dangerGlow : glowStyles;

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    finalGlow,
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button, cn };
