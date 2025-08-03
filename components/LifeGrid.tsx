"use client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormSection } from "./FormSection";
import { StatsSection } from "./StatsSection";
import { GridVisualization } from "./GridVisualization";

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LifeGrid</h1>
          <p className="text-lg text-gray-600 mb-6">
            Visualize your life in days. Each square represents one day.
          </p>

          {/* Form Inputs */}
          <FormSection control={control} errors={errors} />

          {/* Stats and Grid - Only show after birth date is selected */}
          {isValidBirthDate && (
            <>
              <StatsSection
                currentAge={currentAge}
                daysPassed={daysPassed}
                daysRemaining={daysRemaining}
                weeksLived={weeksLived}
                monthsLived={monthsLived}
                percentageLived={percentageLived}
              />
              <GridVisualization
                days={days}
                lifeExpectancy={lifeExpectancy}
                totalDays={TOTAL_DAYS}
                squareSize={SQUARE_SIZE}
                squareSpacing={SQUARE_SPACING}
                gridCols={GRID_COLS}
                gridRows={GRID_ROWS}
              />
            </>
          )}
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
