import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resultData = [
  {
    id: 1,
    title: "Aptitude Test",
    score: "18/20",
    timeTaken: "25 mins",
    difficulty: "Easy",
    status: "Passed",
  },
  {
    id: 2,
    title: "Logical Reasoning",
    score: "15/25",
    timeTaken: "38 mins",
    difficulty: "Medium",
    status: "Failed",
  },
  {
    id: 3,
    title: "Verbal Ability",
    score: "12/15",
    timeTaken: "20 mins",
    difficulty: "Easy",
    status: "Passed",
  },
  {
    id: 4,
    title: "Coding Challenge",
    score: "6/10",
    timeTaken: "55 mins",
    difficulty: "Hard",
    status: "Passed",
  },
];

const ResultPage = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Toggle between all results and only passed ones
  const filteredResults = showAll
    ? resultData
    : resultData.filter((result) => result.status === "Passed");

  const handleSeeResult = (testId: number) => {
    navigate(`/result/${testId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Test Results</h1>

      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <Button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Passed Only" : "Show All Results"}
        </Button>
      </div>

      {/* Result Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResults.map((result) => (
          <Card
            key={result.id}
            className="shadow-lg p-4 hover:scale-105 transition-transform"
          >
            <CardHeader>
              <CardTitle className="text-xl">{result.title}</CardTitle>
              <CardDescription className="text-gray-600">
                Score: {result.score}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm px-3">
                  {result.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">
                  ⏳ {result.timeTaken}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-semibold ${
                    result.status === "Passed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {result.status}
                </span>
                <Button size="sm" onClick={() => handleSeeResult(result.id)}>
                  See Result
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
  