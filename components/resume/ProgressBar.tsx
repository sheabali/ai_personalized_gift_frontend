"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  color: string;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, label }) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <motion.div 
          className="h-2.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
