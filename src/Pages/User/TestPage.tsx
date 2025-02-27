import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store"; // Import your store types
import { getPracticeTests } from "../../../store/Actions/testActions";

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

const TestPage = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { practiceTests, loading, error } = useSelector(
    (state: RootState) => state.test
  );

  console.log(practiceTests);

  useEffect(() => {
    dispatch(getPracticeTests());
  }, [dispatch]);

  // Filter tests based on search input
  const filteredTests = practiceTests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const handleStartTest = (testId: number) => {
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

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-600">Loading tests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Test Cards Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              className="shadow-lg p-4 hover:scale-105 transition-transform"
            >
              <CardHeader>
                <CardTitle className="text-xl">{test.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {test.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {/* Difficulty & Total Questions */}
                <div className="flex justify-between items-center">
                  {/* Created At Timestamp */}
                  <span className="text-sm text-gray-500">
                    {test.totalQuestions} Questions
                  </span>
                  <div className="text-xs text-gray-400 text-right">
                    🕒
                    {new Date(test.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Time Limit & Start Button */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    ⏳ {test.timeLimit} min
                  </span>
                  <Button size="sm" onClick={() => handleStartTest(test.id)}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestPage;
