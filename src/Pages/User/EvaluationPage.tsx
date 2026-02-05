import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { getRealTests } from "../../../store/Actions/testActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, ArrowRight } from "lucide-react";
import {hideSidebar} from "../../../store/Slices/sidebarSlice.ts";

const EvaluationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { realTests, loading, error } = useSelector(
    (state: RootState) => state.test
  ) as {
    realTests: any[];
    loading: boolean;
    error: string | { message: string } | null;
  }

  useEffect(() => {
    dispatch(getRealTests());
  }, [dispatch]);

  const filteredTests = realTests?.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartTest = (testId: number) => {
    dispatch(hideSidebar());
    navigate(`/test/${testId}`);
  };

  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Enhanced Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Evaluation Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Assess your skills with timed evaluation exams
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder="🔍 Search evaluations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border-2 focus:border-red-500 transition-all"
        />
      </div>

      {/* Loading/Error Handling */}
      {loading && (
        <p className="text-center text-gray-600">Loading evaluations...</p>
      )}


      {error && <p className="text-center text-red-600">{ typeof error=== 'string' ? error : error?.message}</p>}

      {/* Enhanced Test Cards Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests?.length > 0 ? (
            filteredTests.map((test) => (
              <Card
                key={test._id}
                className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-red-900/20 dark:to-orange-900/20" />

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
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {test.totalQuestions}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Questions
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
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
                      onClick={() => handleStartTest(test._id)}
                      className="rounded-lg bg-red-600 hover:bg-red-700 transition-transform hover:-translate-y-1"
                    >
                      Start Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full py-12">
              No evaluation tests found matching your search
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;
