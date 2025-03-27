import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store/store.ts";
import { getTopNStudents } from "../../../store/Actions/adminAction.ts";
import { RootState } from "../../../store/store.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const QualifyStudents = () => {
    const dispatch = useAppDispatch();
    const { topStudents, isLoading, error } = useSelector((state: RootState) => state.admin);
    const [limit, setLimit] = useState<number>(10);
    const [testId, setTestId] = useState<number>(1);

    const fetchTopStudents = () => {
        dispatch(getTopNStudents({ testId, limit }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="testId">Test ID</Label>
                    <Input
                        id="testId"
                        type="number"
                        value={testId}
                        onChange={(e) => setTestId(Number(e.target.value))}
                        className="w-32"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="limit">Number of Top Students</Label>
                    <Input
                        id="limit"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-32"
                        min="1"
                    />
                </div>

                <Button onClick={fetchTopStudents} disabled={isLoading}>
                    {isLoading ? "Fetching..." : "Get Students"}
                </Button>
            </div>

            {error && (
                <div className="mb-4 text-red-500">
                    Error: {typeof error === 'string' ? error : error.message}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Students</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(limit)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topStudents.map((student) => (
                                <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">{student.student.firstName} {student.student.lastName}</h3>
                                        <p className="text-sm text-gray-500">{student.student.email}</p>
                                    </div>
                                    <div className="text-lg font-semibold">
                                        Score: {student.score}/{student.totalQuestions}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && topStudents.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            No students found for this test
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default QualifyStudents;