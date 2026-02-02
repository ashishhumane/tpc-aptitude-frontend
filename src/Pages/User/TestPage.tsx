import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
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
import { hideSidebar } from "../../../store/Slices/sidebarSlice";

/* ---------------- TYPES ---------------- */

type Test = {
  _id: string;
  name: string;
  description?: string;
  totalQuestions: number;
  timeLimit: number;
  createdAt: string;
};

const TestPage = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { practiceTests = [], loading, error } = useSelector(
    (state: RootState) => state.test
  ) as {
    practiceTests: Test[];
    loading: boolean;
    error: string | { message: string } | null;
  };

  /* ---------- FETCH TESTS ---------- */
  useEffect(() => {
    dispatch(getPracticeTests());
  }, [dispatch]);

  /* ---------- FILTER ---------- */
  const filteredTests = practiceTests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- START TEST ---------- */
  const handleStartTest = (testId: string) => {
    if (!testId) return; // safety guard
    dispatch(hideSidebar());
    navigate(`/test/${testId}`);
  };

  /* ---------- BLOCK SHORTCUTS ---------- */
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ---------- UI ---------- */
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

      {/* Search */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder="🔍 Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border-2 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-600">
          Loading practice tests...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600">
          {typeof error === "string" ? error : error.message}
        </p>
      )}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card
              key={test._id}
              className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {test.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {test.description || "No description available"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {test.totalQuestions}
                    </div>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {test.timeLimit}
                    </div>
                    <p className="text-xs text-gray-500">Minutes</p>
                  </div>
                </div>

                <div className="border-t" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(test.createdAt).toLocaleDateString()}
                  </div>

                  <Button
                    onClick={() => handleStartTest(test._id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Now <ArrowRight className="w-4 h-4 ml-1" />
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
