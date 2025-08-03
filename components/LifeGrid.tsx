"use client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar22 as DatePickerWithInput } from "./DatePickerWithInput";
import { Controller } from "react-hook-form";

// Day interface for future hover functionality
// interface Day {
//   id: number;
//   x: number;
//   y: number;
//   isPast: boolean;
//   week: number;
//   year: number;
// }

const formSchema = z.object({
  birthDate: z
    .date({
      message: "Please select your birth date",
    })
    .refine(
      (date) => {
        const today = new Date();
        return date <= today;
      },
      {
        message: "Birth date must be in the past",
      }
    ),
  lifeExpectancy: z
    .number()
    .min(50, "Life expectancy must be at least 50 years")
    .max(120, "Life expectancy cannot exceed 120 years"),
});

type FormData = z.infer<typeof formSchema>;

const LifeGrid = () => {
  // Commented out hover functionality for now
  // const [hoveredDay, setHoveredDay] = useState<Day | null>(null);
  // const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lifeExpectancy: 75,
    },
  });

  const {
    watch,
    control,
    formState: { errors },
  } = form;
  const birthDate = watch("birthDate");
  const lifeExpectancy = watch("lifeExpectancy") || 75;

  // Calculate days based on life expectancy
  const TOTAL_DAYS = lifeExpectancy * 365;
  const GRID_COLS = 52; // weeks per year
  const GRID_ROWS = Math.ceil(TOTAL_DAYS / GRID_COLS);

  // Square and spacing dimensions
  const SQUARE_SIZE = 8; // Size of each square
  const SQUARE_SPACING = 10; // Spacing between squares

  const daysPassed = useMemo(() => {
    if (!birthDate) return 0;

    const today = new Date();
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }, [birthDate]);

  const daysRemaining = Math.max(0, TOTAL_DAYS - daysPassed);
  const percentageLived = birthDate
    ? ((daysPassed / TOTAL_DAYS) * 100).toFixed(1)
    : "0";

  // Current age calculation
  const currentAge = birthDate ? Math.floor(daysPassed / 365) : 0;

  // Weeks and months calculations
  const weeksLived = Math.floor(daysPassed / 7);
  const monthsLived = Math.floor(daysPassed / 30.44); // Average days per month

  const days = useMemo(() => {
    const generatedDays: Array<{
      id: number;
      x: number;
      y: number;
      isPast: boolean;
      week: number;
      year: number;
    }> = [];

    for (let i = 0; i < TOTAL_DAYS; i++) {
      const isPast = i < daysPassed;
      const row = Math.floor(i / GRID_COLS);
      const col = i % GRID_COLS;

      generatedDays.push({
        id: i, // This ID helps React efficiently update only changed squares
        x: col * SQUARE_SPACING,
        y: row * SQUARE_SPACING,
        isPast,
        week: col + 1,
        year: Math.floor(i / 365) + 1,
      });
    }
    return generatedDays;
  }, [daysPassed, TOTAL_DAYS, GRID_COLS, SQUARE_SPACING]);

  /*  const handleDayHover = useCallback((day: Day) => {
    setHoveredDay(day);
    setShowTooltip(true);
  }, []); */

  // Commented out hover functionality for now
  // const handleDayLeave = useCallback(() => {
  //   setShowTooltip(false);
  //   setHoveredDay(null);
  // }, []);

  const isValidBirthDate = birthDate && !errors.birthDate;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style> */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LifeGrid</h1>
          <p className="text-lg text-gray-600 mb-6">
            Visualize your life in days. Each square represents one day.
          </p>

          {/* Inputs */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tell us about yourself
              </h3>
              <div className="space-y-4">
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePickerWithInput
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.birthDate?.message}
                    />
                  )}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Life expectancy (years):
                  </label>
                  <Controller
                    name="lifeExpectancy"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        value={field.value || 75}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min="50"
                        max="120"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.lifeExpectancy
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.lifeExpectancy && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lifeExpectancy.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Grid - Only show after birth date is selected */}
          {isValidBirthDate && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-gray-900">
                    {currentAge}
                  </div>
                  <div className="text-xs text-gray-600">Current Age</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-blue-600">
                    {daysPassed.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Days Lived</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-green-600">
                    {daysRemaining.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Days Remaining</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-purple-600">
                    {weeksLived.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Weeks Lived</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-orange-600">
                    {monthsLived.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Months Lived</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-xl font-bold text-red-600">
                    {percentageLived}%
                  </div>
                  <div className="text-xs text-gray-600">Life Lived</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, Number(percentageLived))}%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {percentageLived}% Complete
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-800 rounded border border-gray-700"></div>
            <span className="text-sm font-medium text-gray-700">
              Days lived
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-200 border border-blue-300 rounded"></div>
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
              <div className="flex flex-col justify-between text-xs text-gray-400 pr-2">
                {Array.from(
                  { length: Math.min(10, lifeExpectancy) },
                  (_, i) => {
                    const year = (i + 1) * Math.ceil(lifeExpectancy / 10);
                    if (year <= lifeExpectancy) {
                      return (
                        <div key={year} className="h-8 flex items-center">
                          {year}
                        </div>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              {/* Main grid */}
              <div className="relative">
                <svg
                  width={GRID_COLS * SQUARE_SPACING}
                  height={GRID_ROWS * SQUARE_SPACING}
                  className="border border-gray-200 rounded-lg shadow-sm"
                  viewBox={`0 0 ${GRID_COLS * SQUARE_SPACING} ${
                    GRID_ROWS * SQUARE_SPACING
                  }`}
                  style={{ maxWidth: "100%", height: "auto" }}
                >
                  {/* Grid background lines for years */}
                  {Array.from({ length: lifeExpectancy }, (_, i) => (
                    <line
                      key={`year-${i}`}
                      x1="0"
                      y1={((i + 1) * 52 * SQUARE_SPACING) / lifeExpectancy}
                      x2={GRID_COLS * SQUARE_SPACING}
                      y2={((i + 1) * 52 * SQUARE_SPACING) / lifeExpectancy}
                      stroke="#f3f4f6"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  ))}

                  {days.map((day, index) => (
                    <rect
                      key={`day-${day.id}`} // Unique key for efficient React updates
                      data-day-id={day.id} // Helpful for debugging/testing
                      x={day.x}
                      y={day.y}
                      width={SQUARE_SIZE}
                      height={SQUARE_SIZE}
                      fill={day.isPast ? "#1f2937" : "#dbeafe"}
                      stroke={day.isPast ? "#374151" : "#93c5fd"}
                      strokeWidth="0.5"
                      rx="1.5"
                      ry="1.5"
                      className="cursor-pointer transition-all duration-200 hover:stroke-2 hover:fill-opacity-90"
                      style={{
                        animation: day.isPast
                          ? `fadeIn 0.05s ease-in ${index * 0.001}s both`
                          : "none",
                      }}
                      // onMouseEnter={() => handleDayHover(day)}
                      // onMouseLeave={handleDayLeave}
                    />
                  ))}
                </svg>

                {/* Tooltip */}
                {/* {showTooltip && hoveredDay && (
                  <div
                    className="absolute z-20 bg-gray-900 text-white text-sm rounded-lg py-3 px-4 pointer-events-none shadow-xl border border-gray-700"
                    style={{
                      left: hoveredDay.x + SQUARE_SIZE / 2,
                      top: hoveredDay.y - 10,
                      transform: "translateX(-50%) translateY(-100%)",
                    }}
                  >
                    <div className="font-semibold">Day {hoveredDay.id + 1}</div>
                    <div className="text-gray-300">
                      Year {hoveredDay.year}, Week {hoveredDay.week}
                    </div>
                    <div
                      className={`text-xs mt-1 px-2 py-1 rounded ${
                        hoveredDay.isPast
                          ? "bg-gray-700 text-gray-200"
                          : "bg-blue-600 text-blue-100"
                      }`}
                    >
                      {hoveredDay.isPast ? "✓ Lived" : "○ Future"}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"></div>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* Year markers and info */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                Each row represents one year (52 weeks)
              </p>
              <p className="text-xs text-gray-500">
                Based on {lifeExpectancy}-year life expectancy •{" "}
                {TOTAL_DAYS.toLocaleString()} total days
              </p>
            </div>

            {/* Visual scale indicator */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-300 rounded-sm" />
                  ))}
                </div>
                <span>= 10 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            &ldquo;The meaning of life is that it stops.&rdquo; - Franz Kafka
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Remember: each day is a gift. Make it count.
          </p>

          {isValidBirthDate && (
            <div className="mt-4 text-xs text-gray-400">
              <p>Time is the most valuable resource we have.</p>
              <p>
                You have lived {((daysPassed / TOTAL_DAYS) * 100).toFixed(2)}%
                of your expected life.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeGrid;
