import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const baseStyle = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/40",
    secondary: "bg-surface border border-border text-textPrimary hover:bg-black/5 dark:hover:bg-white/5",
    danger: "bg-danger text-white hover:bg-danger/90 shadow-danger/20 hover:shadow-danger/40",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary shadow-none"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base font-semibold"
  };

  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.95 }}
      className={cn(baseStyle, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </motion.button>
  );
}
