"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

type Option = {
  text: string;
  imageLink: string | null;
  isCorrect: boolean;
};

type Question = {
  text: string;
  imageLink: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  options: Option[];
};

type TestForm = {
  name: string;
  timeLimit: number;
  isListed: boolean;
  isQuickEvaluation: boolean;
  description: string;
  questions: Question[];
};

export default function CreateTestForm() {
  const { control, handleSubmit, register, setValue } = useForm<TestForm>({
    defaultValues: {
      name: "",
      timeLimit: 60,
      isListed: false,
      isQuickEvaluation: false,
      description: "",
      questions: [
        {
          text: "",
          imageLink: "",
          difficulty: "Easy",
          options: Array(4).fill({ text: "", imageLink: "", isCorrect: false }),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const token = useSelector((state: any) => state.auth.token);
  const onSubmit = async (data: TestForm) => {
    try {
      console.log("Test Data:", data);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/create-test`,
        data, // This is the request body
        {
          headers: {
            Authorization: token, // Headers should be inside this object
          },
        }
      );
      if (response.status == 201) {
        return toast.success("Event Created Successfully");
      } else {
        return toast.error("Test Creation Failed");
      }
    } catch (error: any) {
      return toast.error("Something Went Wrong", error?.message);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-4  p-8">
      {" "}
      {/* Increased form width */}
      <CardHeader>
        <CardTitle>Create a New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Test Name */}
          <div>
            <Label>Test Name</Label>
            <Input
              {...register("name")}
              placeholder="Enter test name"
              className="w-full"
            />
          </div>

          {/* Time Limit */}
          <div>
            <Label>Time Limit (minutes)</Label>
            <Input
              type="number"
              {...register("timeLimit")}
              placeholder="Enter time limit"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Enter test description"
              className="w-full"
            />
          </div>

          {/* Is Listed */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isListed"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    setValue("isListed", checked as boolean)
                  }
                />
              )}
            />
            <Label>List this test?</Label>
          </div>

          {/* Is Quick Evaluation */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isQuickEvaluation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    setValue("isQuickEvaluation", checked as boolean)
                  }
                />
              )}
            />
            <Label>Enable Quick Evaluation?</Label>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Questions</h3>
            {fields.map((question, qIndex) => (
              <div
                key={question.id}
                className="p-6 border rounded-lg space-y-4"
              >
                <div>
                  <Label>Question {qIndex + 1}</Label>
                  <Input
                    {...register(`questions.${qIndex}.text`)}
                    placeholder="Enter question text"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Question Image Link (Optional)</Label>
                  <Input
                    {...register(`questions.${qIndex}.imageLink`)}
                    placeholder="Enter image URL"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <select
                    {...register(`questions.${qIndex}.difficulty`)}
                    className="p-2 border rounded-md dark:bg-zinc-950 w-full"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Options Section */}
                <div className="space-y-2 flex flex-row gap-6">
                  <h4 className="text-md font-medium">Options</h4>
                  {question.options.map((_, oIndex) => (
                    <div key={oIndex} className="flex flex-col space-y-2">
                      <Input
                        {...register(
                          `questions.${qIndex}.options.${oIndex}.text`
                        )}
                        placeholder={`Option ${oIndex + 1} Text`}
                        className="w-full"
                      />
                      <Input
                        {...register(
                          `questions.${qIndex}.options.${oIndex}.imageLink`
                        )}
                        placeholder={`Option ${oIndex + 1} Image URL`}
                        className="w-full"
                      />
                      <div className="flex items-center space-x-2">
                        <Controller
                          name={`questions.${qIndex}.options.${oIndex}.isCorrect`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  // Uncheck other options for this question
                                  question.options.forEach((_, index) => {
                                    setValue(
                                      `questions.${qIndex}.options.${index}.isCorrect`,
                                      index === oIndex
                                    );
                                  });
                                }
                              }}
                            />
                          )}
                        />
                        <Label>Correct?</Label>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(qIndex)}
                >
                  Remove Question
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  text: "",
                  imageLink: "",
                  difficulty: "Easy",
                  options: Array(4).fill({
                    text: "",
                    imageLink: "",
                    isCorrect: false,
                  }),
                })
              }
            >
              Add Question
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
