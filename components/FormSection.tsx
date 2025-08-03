"use client";

import React from "react";
import { Control, FieldErrors, Controller } from "react-hook-form";
import { Calendar22 as DatePickerWithInput } from "./DatePickerWithInput";
import { Label } from "./ui/label";

interface FormData {
  birthDate: Date;
  lifeExpectancy: number;
}

interface FormSectionProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

// Life expectancy options with context
const lifeExpectancyOptions = [
  { value: 70, label: "70 years", description: "Lower estimate" },
  { value: 75, label: "75 years", description: "Global average" },
  { value: 80, label: "80 years", description: "Developed countries" },
  { value: 85, label: "85 years", description: "Higher estimate" },
  { value: 90, label: "90 years", description: "Optimistic" },
  { value: 95, label: "95 years", description: "Very optimistic" },
];

export function FormSection({ control, errors }: FormSectionProps) {
  return (
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
            <Label htmlFor="life-expectancy">Life expectancy:</Label>
            <Controller
              name="lifeExpectancy"
              control={control}
              render={({ field }) => (
                <select
                  id="life-expectancy"
                  value={field.value || 75}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.lifeExpectancy ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {lifeExpectancyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
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
  );
}
