"use client";

import { useEffect, useState } from "react";
import DemoCalendar from "@/components/Calender";
import { CarouselDemo } from "@/components/Carausel";
import { ScrollArea } from "@/components/ui/scroll-area";
import Resources from "@/components/Resources";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [topStudents, setTopStudents] = useState([]);
  const [topStudentsError, setTopStudentsError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/test/get-real-tests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();
        setTests(data);
        if (data.length > 0) {
          setSelectedTest(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (!selectedTest) return;

    const fetchTopStudents = async () => {
      setTopStudentsError(""); // Reset error before fetching

      try {
        const response = await fetch(
          "http://localhost:5000/api/test/get-top-students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ testId: selectedTest }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch top students: ${response.statusText}`);
        }

        const data = await response.json();
        setTopStudents(data);
      } catch (error) {
        console.error("Error fetching top students:", error);
        if (error instanceof Error) {
          setTopStudentsError(error.message);
        } else {
          setTopStudentsError("An unknown error occurred");
        }
      }
    };

    fetchTopStudents();
  }, [selectedTest]);

  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <h1 className="lg:text-4xl text-xl font-bold text-center">
        TPC-PCE Aptitude Portal
      </h1>

      <div className="flex flex-col lg:flex-row gap-14">
        {/* Carousel */}
        <div className="flex-1">
          <CarouselDemo />
        </div>

        {/* Scrollable Top Scorers Section */}
        <ScrollArea className="lg:w-1/4 w-full h-96 border rounded-lg shadow-md p-4 bg-white dark:bg-black">
          <h2 className="text-lg font-semibold mb-2">🏆 Top 10 Scorers</h2>

          {/* Test Selection Dropdown */}
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-full mb-3">
              <SelectValue placeholder="Select a Test" />
            </SelectTrigger>
            <SelectContent>
              {tests.map((test: any) => (
                <SelectItem key={test.id} value={test.id}>
                  {test.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {topStudentsError ? (
            <p className="text-red-500 text-center">{topStudentsError}</p>
          ) : (
            <ul className="space-y-2">
              {topStudents.length > 0 ? (
                topStudents.map((student: any, index) => (
                  <Card key={index} className="p-3 flex justify-between">
                    <span className="font-medium">
                      {index + 1}. {student.name}
                    </span>
                    <span className="font-bold text-blue-600">
                      {student.marks}
                    </span>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center">No results available</p>
              )}
            </ul>
          )}
        </ScrollArea>
      </div>

      {/* Calendar */}
      <DemoCalendar />
      <Resources />
    </div>
  );
};

export default Dashboard;
