"use client";

import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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

/* ---------------- TYPES ---------------- */

type Option = {
  text: string;
  imageLink: string | null;
  isCorrect: boolean;
  imageFile?: File;
};

type Question = {
  text: string;
  imageLink: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  options: Option[];
  imageFile?: File;
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
  const { control, handleSubmit, register, setValue, getValues } =
    useForm<TestForm>({
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
            options: Array.from({ length: 4 }, () => ({
              text: "",
              imageLink: null,
              isCorrect: false,
            })),
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  /* ✅ SAFE: single hook call */
  const watchedQuestions = useWatch({
    control,
    name: "questions",
  });

  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (data: TestForm) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("timeLimit", String(data.timeLimit));
      formData.append("isListed", String(data.isListed));
      formData.append("quickEvaluation", String(data.quickEvaluation));
      formData.append("description", data.description || "");

      const questionsPayload = data.questions.map((q) => ({
        text: q.text,
        imageLink: null,
        difficulty: q.difficulty,
        options: q.options.map((o) => ({
          text: o.text,
          imageLink: null,
          isCorrect: o.isCorrect,
        })),
      }));

      formData.append("questions", JSON.stringify(questionsPayload));

      data.questions.forEach((q, qIndex) => {
        if (q.imageFile) {
          formData.append(`questionImage_${qIndex}`, q.imageFile);
        }

        q.options.forEach((o, oIndex) => {
          if (o.imageFile) {
            formData.append(
              `optionImage_${qIndex}_${oIndex}`,
              o.imageFile
            );
          }
        });
      });

      const result = await dispatch(createTest(formData));

      if (createTest.fulfilled.match(result)) {
        toast.success("Test Created Successfully!");
      } else {
        toast.error("Test Creation Failed");
      }
    } catch {
      toast.error("Something Went Wrong");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="w-full mx-4 p-8">
      <CardHeader>
        <CardTitle>Create a New Test</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Test Name</Label>
            <Input {...register("name")} />
          </div>

          <div>
            <Label>Time Limit (minutes)</Label>
            <Input type="number" {...register("timeLimit")} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="isListed"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) =>
                    setValue("isListed", v as boolean)
                  }
                />
              )}
            />
            <Label>List this test?</Label>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="quickEvaluation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) =>
                    setValue("quickEvaluation", v as boolean)
                  }
                />
              )}
            />
            <Label>Enable Quick Evaluation?</Label>
          </div>

          <h3 className="text-lg font-semibold">Questions</h3>

          {fields.map((question, qIndex) => {
            const qImageSelected =
              watchedQuestions?.[qIndex]?.imageLink;

            return (
              <div key={question.id} className="p-6 border rounded space-y-4">
                <Textarea
                  {...register(`questions.${qIndex}.text`)}
                  disabled={!!qImageSelected}
                  placeholder="Type question OR upload image"
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files?.[0]) return;
                    getValues().questions[qIndex].imageFile =
                      e.target.files[0];
                    setValue(`questions.${qIndex}.imageLink`, "FILE");
                    setValue(`questions.${qIndex}.text`, "");
                  }}
                />

                <h4 className="font-semibold">Options</h4>

                {question.options.map((_, optIndex) => {
                  const optImageSelected =
                    watchedQuestions?.[qIndex]?.options?.[optIndex]
                      ?.imageLink;

                  return (
                    <div
                      key={optIndex}
                      className="border p-3 rounded space-y-2"
                    >
                      <Textarea
                        {...register(
                          `questions.${qIndex}.options.${optIndex}.text`
                        )}
                        disabled={!!optImageSelected}
                        placeholder={`Option ${optIndex + 1}`}
                      />

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (!e.target.files?.[0]) return;
                          getValues().questions[qIndex].options[
                            optIndex
                          ].imageFile = e.target.files[0];
                          setValue(
                            `questions.${qIndex}.options.${optIndex}.imageLink`,
                            "FILE"
                          );
                          setValue(
                            `questions.${qIndex}.options.${optIndex}.text`,
                            ""
                          );
                        }}
                      />

                      <Controller
                        name={`questions.${qIndex}.options.${optIndex}.isCorrect`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) =>
                                setValue(
                                  `questions.${qIndex}.options.${optIndex}.isCorrect`,
                                  v as boolean
                                )
                              }
                            />
                            <Label>Correct</Label>
                          </div>
                        )}
                      />
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(qIndex)}
                >
                  Remove Question
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() =>
              append({
                text: "",
                imageLink: null,
                difficulty: "Easy",
                options: Array.from({ length: 4 }, () => ({
                  text: "",
                  imageLink: null,
                  isCorrect: false,
                })),
              })
            }
          >
            Add Question
          </Button>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
