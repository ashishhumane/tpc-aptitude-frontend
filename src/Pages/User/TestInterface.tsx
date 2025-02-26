import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react";

// Sample test data
const testInfo = {
  title: "Aptitude Test",
  totalQuestions: 10,
  difficulty: "Medium",
};

// Sample questions
const questions = [
  {
    id: 1,
    text: "What is 15 + 8?",
    image: null,
    options: [
      { id: "A", type: "text", content: "20" },
      { id: "B", type: "text", content: "23" },
      { id: "C", type: "text", content: "25" },
      { id: "D", type: "text", content: "30" },
    ],
  },
  {
    id: 2,
    text: "Identify the shape.",
    image: "https://via.placeholder.com/200", // Example image
    options: [
      { id: "A", type: "image", content: "https://via.placeholder.com/100" },
      { id: "B", type: "image", content: "https://via.placeholder.com/100" },
      { id: "C", type: "image", content: "https://via.placeholder.com/100" },
      { id: "D", type: "image", content: "https://via.placeholder.com/100" },
    ],
  },
];

const TestInterface = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const question = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null); // Reset selection
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null); // Reset selection
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Test Header */}
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow">
        <h2 className="text-xl font-bold text-black">{testInfo.title}</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-black">
            Total: {testInfo.totalQuestions} Qs
          </Badge>
          <Badge variant="outline" className="text-black">
            Difficulty: {testInfo.difficulty}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCalculatorOpen(!calculatorOpen)}
          >
            <Calculator className="w-5 h-5 mr-1" /> Calculator
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Question & Options Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left: Question Section */}
        <Card className="col-span-2 p-4">
          <CardHeader>
            <CardTitle>Question {question.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{question.text}</p>
            {question.image && (
              <img
                src={question.image}
                alt="Question"
                className="mt-3 rounded-md"
              />
            )}
          </CardContent>
        </Card>

        {/* Right: Options Section */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Choose an Option</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {question.options.map((option) => (
              <Button
                key={option.id}
                variant={selectedOption === option.id ? "default" : "outline"}
                onClick={() => setSelectedOption(option.id)}
                className="p-3"
              >
                {option.type === "text" ? (
                  option.content
                ) : (
                  <img
                    src={option.content}
                    alt="Option"
                    className="w-16 h-16 rounded-md"
                  />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        <span className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} / {testInfo.totalQuestions}
        </span>
        <Button
          variant="default"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TestInterface;
