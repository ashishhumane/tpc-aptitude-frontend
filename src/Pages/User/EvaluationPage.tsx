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

const evaluationTests = [
  {
    id: 1,
    title: "Final Aptitude Test",
    description: "Comprehensive aptitude assessment.",
    timeLimit: "45 mins",
    difficulty: "Medium",
    totalQuestions: 30,
  },
  {
    id: 2,
    title: "Advanced Logical Reasoning",
    description: "Evaluate logical and analytical thinking.",
    timeLimit: "50 mins",
    difficulty: "Hard",
    totalQuestions: 35,
  },
  {
    id: 3,
    title: "Technical Evaluation",
    description: "Assess programming and problem-solving skills.",
    timeLimit: "75 mins",
    difficulty: "Hard",
    totalQuestions: 20,
  },
  {
    id: 4,
    title: "General Awareness",
    description: "Test your knowledge of current affairs.",
    timeLimit: "30 mins",
    difficulty: "Medium",
    totalQuestions: 25,
  },
  {
    id: 5,
    title: "English Proficiency Test",
    description: "Evaluate grammar, vocabulary, and comprehension.",
    timeLimit: "40 mins",
    difficulty: "Easy",
    totalQuestions: 20,
  },
];

const EvaluationPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter tests based on search input
  const filteredTests = evaluationTests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartTest = (testId: any) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">🎯 Evaluation Tests</h1>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search evaluation tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-lg p-3"
        />
      </div>

      {/* Test Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
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
          ))
        ) : (
          <p className="text-center text-gray-600">No evaluation tests available.</p>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;
