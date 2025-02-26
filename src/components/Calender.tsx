"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

// Define the type for test data
type TestData = {
  [key: string]: string[];
};

// Sample test data (Replace with real API data later)
const testData: TestData = {
  "2025-02-26": ["Math Test", "Physics Quiz"], 
  "2025-02-27": ["Chemistry Assessment"],
  "2025-02-28": ["Mock Aptitude Test", "English Proficiency Test"],
};

export default function DemoCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Ensure that the selected date is properly formatted as "yyyy-MM-dd"
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Get tests for the selected date
  const testsForSelectedDate = testData[formattedDate] || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 w-full">
      {/* Left Section: Test List (3/4 Width) */}
      <Card className="w-full max-h-96">
        <CardHeader>
          <CardTitle>
            Tests on{" "}
            {selectedDate
              ? format(selectedDate, "MMMM dd, yyyy")
              : "Select a Date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testsForSelectedDate.length > 0 ? (
            <ul className="space-y-2">
              {testsForSelectedDate.map((test, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-100 text-black dark:bg-black dark:text-white rounded-md"
                >
                  {test}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tests scheduled for this date.</p>
          )}
        </CardContent>
      </Card>

      {/* Right Section: Calendar (1/4 Width) */}
      <Card className="w-full lg:w-1/2 max-h-96">
        <CardHeader>
          <CardTitle>Select a Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => {
              if (day) {
                // Ensure the selected date is in the same format as testData keys
                const formattedDay = format(day, "yyyy-MM-dd");
                setSelectedDate(parseISO(formattedDay));
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
