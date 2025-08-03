"use client";

import React from "react";

interface Day {
  id: number;
  x: number;
  y: number;
  isPast: boolean;
  week: number;
  year: number;
}

interface GridVisualizationProps {
  days: Day[];
  lifeExpectancy: number;
  totalDays: number;
  squareSize: number;
  squareSpacing: number;
  gridCols: number;
  gridRows: number;
}

export function GridVisualization({
  days,
  lifeExpectancy,
  totalDays,
  squareSize,
  squareSpacing,
  gridCols,
  gridRows,
}: GridVisualizationProps) {
  // Find today's day (first day that's not past)
  const todayIndex = days.findIndex((day) => !day.isPast);
  const isToday = (index: number) => index === todayIndex;
  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        .pulsing {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Legend */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-600 rounded border border-gray-500"></div>
          <span className="text-sm font-medium text-gray-700">Days lived</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded border border-blue-600"></div>
          <span className="text-sm font-medium text-gray-700">Today</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
          <span className="text-sm font-medium text-gray-700">
            Days remaining
          </span>
        </div>
      </div>

      {/* Life Grid */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg overflow-auto relative">
        <div className="flex justify-center">
          <div className="relative flex gap-4">
            {/* Year labels */}
            {/*  <div className="flex flex-col justify-between text-xs text-gray-400 pr-2">
              {Array.from({ length: Math.min(10, lifeExpectancy) }, (_, i) => {
                const year = (i + 1) * Math.ceil(lifeExpectancy / 10);
                if (year <= lifeExpectancy) {
                  return (
                    <div key={year} className="h-8 flex items-center">
                      {year}
                    </div>
                  );
                }
                return null;
              })}
            </div> */}

            {/* Main grid */}
            <div className="relative">
              <svg
                width={gridCols * squareSpacing}
                height={gridRows * squareSpacing}
                className="border border-gray-200 rounded-lg shadow-sm"
                viewBox={`0 0 ${gridCols * squareSpacing} ${
                  gridRows * squareSpacing
                }`}
                style={{ maxWidth: "100%", height: "auto" }}
              >
                {/* Grid background lines for years */}
                {Array.from({ length: lifeExpectancy }, (_, i) => (
                  <line
                    key={`year-${i}`}
                    x1="0"
                    y1={((i + 1) * 52 * squareSpacing) / lifeExpectancy}
                    x2={gridCols * squareSpacing}
                    y2={((i + 1) * 52 * squareSpacing) / lifeExpectancy}
                    stroke="#f3f4f6"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                ))}

                {/* All days - simple and clean */}
                {days.map((day, index) => {
                  const dayIsToday = isToday(index);
                  return (
                    <rect
                      key={`day-${day.id}`}
                      data-day-id={day.id}
                      x={day.x}
                      y={day.y}
                      width={squareSize}
                      height={squareSize}
                      fill={
                        dayIsToday
                          ? "#3b82f6" // blue for today
                          : day.isPast
                          ? "#6b7280" // gray for past days
                          : "#ffffff" // white for future days
                      }
                      stroke={
                        dayIsToday
                          ? "#2563eb"
                          : day.isPast
                          ? "#4b5563"
                          : "#d1d5db"
                      }
                      strokeWidth="0.5"
                      rx="1.5"
                      ry="1.5"
                      className={`cursor-pointer hover:stroke-2 ${
                        dayIsToday ? "pulsing" : ""
                      }`}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Grid Info */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">
              Each row represents one year (52 weeks)
            </p>
            <p className="text-xs text-gray-500">
              Based on {lifeExpectancy}-year life expectancy •{" "}
              {totalDays.toLocaleString()} total days
            </p>
          </div>

          {/* Visual scale indicator */}
          {/*  <div className="flex justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-sm" />
                ))}
              </div>
              <span>= 10 days</span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
