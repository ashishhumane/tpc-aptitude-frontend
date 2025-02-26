import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const testData = [
  {
    id: 1,
    title: "Aptitude Test",
    description: "Basic aptitude questions.",
    timeLimit: "30 mins",
    difficulty: "Easy",
    totalQuestions: 20,
  },
  {
    id: 2,
    title: "Logical Reasoning",
    description: "Test your logical skills.",
    timeLimit: "40 mins",
    difficulty: "Medium",
    totalQuestions: 25,
  },
  {
    id: 3,
    title: "Verbal Ability",
    description: "Grammar and comprehension.",
    timeLimit: "25 mins",
    difficulty: "Easy",
    totalQuestions: 15,
  },
  {
    id: 4,
    title: "Coding Challenge",
    description: "Solve programming problems.",
    timeLimit: "60 mins",
    difficulty: "Hard",
    totalQuestions: 10,
  },
  {
    id: 5,
    title: "General Knowledge",
    description: "Trivia and GK questions.",
    timeLimit: "20 mins",
    difficulty: "Medium",
    totalQuestions: 30,
  },
];

const TestPage = () => {
  const [search, setSearch] = useState("");

  // Filter tests based on search input
  const filteredTests = testData.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const handleStartTest = (testId: any) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">📚 Practice Tests</h1>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-lg p-3"
        />
      </div>

      {/* Test Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTests.map((test) => (
          <Card
            key={test.id}
            className="shadow-lg p-4 hover:scale-105 transition-transform"
          >
            <CardHeader>
              <CardTitle className="text-xl">{test.title}</CardTitle>
              <CardDescription className="text-gray-600">
                {test.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm px-3">
                  {test.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">
                  {test.totalQuestions} Questions
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  ⏳ {test.timeLimit}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    handleStartTest(test.id);
                  }}
                >
                  Start Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
