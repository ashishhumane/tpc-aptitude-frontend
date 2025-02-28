"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../../store/Actions/adminAction";
import { toast } from "sonner";
import { AppDispatch, RootState } from "../../../store/store";

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
  quickEvaluation: boolean;
  description: string;
  questions: Question[];
};

export default function CreateTestForm() {
  const { control, handleSubmit, register, setValue } = useForm<TestForm>({
    defaultValues: {
      name: "",
      timeLimit: 60,
      isListed: false,
      quickEvaluation: false,
      description: "",
      questions: [
        {
          text: "",
          imageLink: null,
          difficulty: "Easy",
          options: Array(3).fill({ text: "", imageLink: null, isCorrect: false }),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  const onSubmit = async (data: TestForm) => {
    const formattedData = {
      ...data,
      timeLimit: Number(data.timeLimit), // Ensure timeLimit is sent as an integer
    };
    try {
      console.log("Submitting Test Data:", formattedData);
      const result = await dispatch(createTest(formattedData));

      if (createTest.fulfilled.match(result)) {
        toast.success("Test Created Successfully!");
      } else {
        toast.error("Test Creation Failed");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Card className="w-full mx-4 p-8">
      <CardHeader>
        <CardTitle>Create a New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Test Name</Label>
            <Input {...register("name")} placeholder="Enter test name" className="w-full" />
          </div>

          <div>
            <Label>Time Limit (minutes)</Label>
            <Input type="number" {...register("timeLimit")} placeholder="Enter time limit" className="w-full" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} placeholder="Enter test description" className="w-full" />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isListed"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("isListed", checked as boolean)}
                />
              )}
            />
            <Label>List this test?</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="quickEvaluation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("quickEvaluation", checked as boolean)}
                />
              )}
            />
            <Label>Enable Quick Evaluation?</Label>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Questions</h3>
            {fields.map((question, qIndex) => (
              <div key={question.id} className="p-6 border rounded-lg space-y-4">
                <div>
                  <Label>Question {qIndex + 1} Text</Label>
                  <Input {...register(`questions.${qIndex}.text`)} placeholder="Enter question text" className="w-full" />
                </div>

                <div>
                  <Label>Question Image URL</Label>
                  <Input {...register(`questions.${qIndex}.imageLink`)} placeholder="Enter image URL (optional)" className="w-full" />
                </div>

                <h4 className="font-semibold">Options</h4>
                {question.options.map((_, optIndex) => (
                  <div key={optIndex} className="space-y-2">
                    <Input {...register(`questions.${qIndex}.options.${optIndex}.text`)} placeholder={`Option ${optIndex + 1}`} className="w-full" />
                    <Input {...register(`questions.${qIndex}.options.${optIndex}.imageLink`)} placeholder="Option Image URL (optional)" className="w-full" />
                    <Controller
                      name={`questions.${qIndex}.options.${optIndex}.isCorrect`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => setValue(`questions.${qIndex}.options.${optIndex}.isCorrect`, checked as boolean)}
                        />
                      )}
                    />
                    <Label>Correct Answer?</Label>
                  </div>
                ))}

                <Button type="button" variant="destructive" onClick={() => remove(qIndex)}>Remove Question</Button>
              </div>
            ))}

            <Button type="button" onClick={() => append({ text: "", imageLink: null, difficulty: "Easy", options: Array(3).fill({ text: "", imageLink: null, isCorrect: false }) })}>
              Add Question
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating..." : "Create Test"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
