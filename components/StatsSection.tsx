"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatsSectionProps {
  currentAge: number;
  daysPassed: number;
  daysRemaining: number;
  weeksLived: number;
  monthsLived: number;
  percentageLived: string;
}

export function StatsSection({
  currentAge,
  daysPassed,
  daysRemaining,
  weeksLived,
  monthsLived,
  percentageLived,
}: StatsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-6"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-gray-900">{currentAge}</div>
          <div className="text-xs text-gray-600">Current Age</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-blue-600">
            {daysPassed.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Days Lived</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-green-600">
            {daysRemaining.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Days Remaining</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-purple-600">
            {weeksLived.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Weeks Lived</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-orange-600">
            {monthsLived.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Months Lived</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-xl font-bold text-red-600">
            {percentageLived}%
          </div>
          <div className="text-xs text-gray-600">Life Lived</div>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="max-w-2xl mx-auto mb-8" variants={itemVariants}>
        <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${Math.min(100, Number(percentageLived))}%`,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.8,
            }}
          ></motion.div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {percentageLived}% Complete
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
