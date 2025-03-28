import { useState } from "react";
import { CalculatorIcon } from "lucide-react";

const ScientificCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isScientific, setIsScientific] = useState(true);
  const [isDegrees, setIsDegrees] = useState(true);

  const factorial = (n: number): number => {
    if (n < 0) throw new Error("Negative factorial");
    return n <= 1 ? 1 : n * factorial(n - 1);
  };

  const processInput = (input: string): string => {
    let processed = input
      .replace(/sin/g, isDegrees ? "Math.sin(Math.PI/180*" : "Math.sin(")
      .replace(/cos/g, isDegrees ? "Math.cos(Math.PI/180*" : "Math.cos(")
      .replace(/tan/g, isDegrees ? "Math.tan(Math.PI/180*" : "Math.tan(")
      .replace(/log/g, "Math.log10(")
      .replace(/ln/g, "Math.log(")
      .replace(/√/g, "Math.sqrt(")
      .replace(/\^/g, "**")
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/!/g, ")");

    // Add closing parentheses for functions
    const functionRegex = /(Math\.(sin|cos|tan|log10|log|sqrt)|\(\d+\.?\d*)\*\*/g;
    const matches = processed.match(functionRegex) || [];
    matches.forEach(() => (processed += ")"));

    return processed;
  };

  const handleClick = (value: string) => {
    if (value === "=") {
      try {
        let expression = input;
        
        // Handle factorial
        if (input.includes("!")) {
          const factorialMatch = input.match(/(\d+)!/);
          if (factorialMatch) {
            const num = parseInt(factorialMatch[1]);
            setResult(factorial(num).toString());
            return;
          }
        }

        expression = processInput(input);
        const evalResult = eval(expression);
        setResult(evalResult.toString());
        setInput(evalResult.toString());
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "⌫") {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const scientificButtons = [
    ["sin", "cos", "tan", "π"],
    ["log", "ln", "√", "e"],
    ["(", ")", "^", "!"],
  ];

  const basicButtons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="fixed right-4 top-24 z-[1000] bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 transition-all duration-300 w-80">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 gap-2">
          <button
            onClick={() => setIsScientific(!isScientific)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {isScientific ? "Basic" : "Scientific"}
          </button>
          <button
            onClick={() => setIsDegrees(!isDegrees)}
            className="text-sm text-purple-500 hover:text-purple-600"
          >
            {isDegrees ? "DEG" : "RAD"}
          </button>
          <button
            onClick={() => handleClick("C")}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-md p-2">
          <div className="text-gray-500 dark:text-gray-400 text-right h-6 text-sm">
            {input}
          </div>
          <div className="text-right text-2xl font-medium dark:text-white">
            {result || "0"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {isScientific &&
          scientificButtons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="p-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-md text-sm"
            >
              {btn}
            </button>
          ))}

        {basicButtons.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className={`p-2 rounded-md ${
              ["=", "+", "-", "*", "/"].includes(btn)
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
            }`}
          >
            {btn}
          </button>
        ))}

        <button
          onClick={() => handleClick("⌫")}
          className="col-span-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-md"
        >
          ⌫ Backspace
        </button>
      </div>
    </div>
  );
};

export default ScientificCalculator;