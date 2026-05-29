import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    isLarge = false,
    opacity = 1,
    blur = 0,
    floatDuration = 12,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    isLarge?: boolean;
    opacity?: number;
    blur?: number;
    floatDuration?: number;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                {isLarge ? (
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            opacity: 0.22,
                            filter: 'blur(60px)',
                            mixBlendMode: 'screen',
                            background: 'rgba(255,255,255,1)',
                        }}
                    />
                ) : (
                    <div
                        className={cn(
                            "absolute inset-0 rounded-full",
                            "backdrop-blur-xl border",
                            "shadow-[0_0_40px_rgba(255,255,255,0.05)]",
                            "after:absolute after:inset-0 after:rounded-full",
                            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_80%)]"
                        )}
                        style={{
                            background: "linear-gradient(120deg, rgba(255,255,255,0.02), rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
                            borderColor: "rgba(255,255,255,0.18)",
                            opacity: opacity,
                            filter: blur > 0 ? `blur(${blur}px)` : 'none',
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
