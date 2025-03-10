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
import { useNavigate } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const TestPage = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { practiceTests, loading, error } = useSelector(
    (state: RootState) => state.test
  ) as {
    practiceTests: any[];
    loading: boolean;
    error: string | { message: string } | null;
  };

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
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 dark:text-primary text-gray-800">
          Practice Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test your knowledge with our curated collection of practice exams
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder="🔍 Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border-2 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Loading & Error Handling */}
      {loading && (
        <p className="text-center text-gray-600">Loading practice tests...</p>
      )}
      {error && (
  <p className="text-center text-red-600">
    {typeof error === 'string' ? error : error?.message}
  </p>
)}


      {/* Improved Test Cards Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-900/20 dark:to-purple-900/20" />

              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {test.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {test.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {test.totalQuestions}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Questions
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {test.timeLimit}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Minutes
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Footer */}
                <div className="flex items-center space-x-4 justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(test.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleStartTest(test.id)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-transform hover:-translate-y-1"
                  >
                    Start Now <ArrowRight className=" h-4 w-4" />
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
