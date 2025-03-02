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
  "2025-03-01": ["Computer Science Exam", "Logical Reasoning Test"],
  "2025-03-02": ["General Knowledge Quiz", "Data Structures Assessment"],
  "2025-03-03": ["Algebra Quiz", "Verbal Reasoning Test"],
  "2025-03-04": ["Biology Final Exam", "Critical Thinking Assessment"],
  "2025-03-05": ["Geography Test", "SQL & Database Quiz"],
  "2025-03-06": ["Mechanical Engineering Test", "C++ Programming Exam"],
  "2025-03-07": [
    "Software Development Principles",
    "JavaScript Coding Challenge",
  ],
  "2025-03-08": ["History Knowledge Test", "Linear Algebra Exam"],
  "2025-03-09": ["Ethical Hacking Quiz", "Artificial Intelligence Test"],
  "2025-03-10": ["Cybersecurity Fundamentals", "Financial Accounting Test"],
  "2025-03-11": ["Marketing Strategies Assessment", "Statistics Quiz"],
  "2025-03-12": ["Entrepreneurship Exam", "Blockchain & Cryptocurrency Quiz"],
  "2025-03-13": ["Physics Laws & Applications Test", "Networking Basics Quiz"],
  "2025-03-14": ["Human Anatomy Exam", "Environmental Science Assessment"],
  "2025-03-15": ["Big Data & Analytics Test", "Cloud Computing Fundamentals"],
  "2025-03-16": [
    "Machine Learning Challenge",
    "React & Frontend Development Quiz",
  ],
  "2025-03-17": [
    "Python Advanced Programming Test",
    "Linux System Administration Quiz",
  ],
  "2025-03-18": [
    "DevOps Fundamentals",
    "Artificial Neural Networks Assessment",
  ],
  "2025-03-19": ["Probability & Statistics Test", "Quantum Computing Basics"],
  "2025-03-20": ["Database Management Systems", "Mobile App Development Quiz"],
  "2025-03-21": ["Digital Marketing & SEO Exam", "Graphic Design Fundamentals"],
  "2025-03-22": ["Astrophysics Knowledge Test", "3D Modeling & Animation Quiz"],
  "2025-03-23": ["Philosophy & Ethics Test", "Corporate Law Exam"],
  "2025-03-24": [
    "Psychology & Human Behavior Test",
    "Sociology & Culture Quiz",
  ],
  "2025-03-25": ["Advanced Calculus Test", "Deep Learning & AI Research Quiz"],
  "2025-03-26": ["Game Development Principles", "Microeconomics Exam"],
  "2025-03-27": [
    "Business Intelligence & Analytics",
    "HR Management & Leadership Test",
  ],
  "2025-03-28": ["Electrical Circuits Quiz", "Robotics & Automation Test"],
  "2025-03-29": ["Space Science & Astronomy Quiz", "Political Science Exam"],
  "2025-03-30": [
    "Biomedical Engineering Quiz",
    "Software Testing & QA Assessment",
  ],
  "2025-03-31": [
    "Cloud Security & Compliance",
    "Penetration Testing Challenge",
  ],
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
