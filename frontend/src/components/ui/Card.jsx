import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export function Card({ className, hover = false, children, ...props }) {
  const ref = useRef(null);
  const { settings } = useTheme();
  
  // Disable 3D if explicitly turned off in settings
  const isHoverEnabled = hover && settings?.effects3d !== false;
  
  // 3D physics values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animation for smooth return
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map mouse position to rotation (-15deg to +15deg max)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!isHoverEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!isHoverEnabled) return;
    x.set(0);
    y.set(0);
  };

  const MotionComponent = isHoverEnabled ? motion.div : 'div';
  const motionProps = isHoverEnabled ? {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { rotateX, rotateY, transformStyle: "preserve-3d" },
    whileHover: { scale: 1.02, zIndex: 10 }
  } : {};

  return (
    <MotionComponent
      className={cn(
        "glass rounded-2xl relative overflow-hidden transition-shadow duration-300",
        isHoverEnabled && "hover:shadow-primary/20",
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* Glossy overlay effect for 3D depth */}
      {isHoverEnabled && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none transform-gpu" style={{ transform: "translateZ(10px)" }} />
      )}
      <div className="relative z-10" style={isHoverEnabled ? { transform: "translateZ(20px)" } : {}}>
        {children}
      </div>
    </MotionComponent>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 border-b border-border/50 bg-black/5 dark:bg-white/5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-semibold text-lg tracking-tight text-textPrimary", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}
