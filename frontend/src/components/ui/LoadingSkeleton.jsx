import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="w-full space-y-4">
      {[...Array(rows)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-12 w-full bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5"
        />
      ))}
    </div>
  );
}
