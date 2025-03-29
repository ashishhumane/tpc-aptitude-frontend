import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store/store.ts";
import { getTopNStudents } from "../../../store/Actions/adminAction.ts";
import { RootState } from "../../../store/store.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const QualifyStudents = () => {
    const dispatch = useAppDispatch();
    const { topStudents, isLoading, error } = useSelector((state: RootState) => state.admin);
    const [limit, setLimit] = useState<number>(10);
    const [testId, setTestId] = useState<number>(1);

    // Sort students by score in descending order
    const sortedStudents = useMemo(() => {
        return [...topStudents].sort((a, b) => b.score - a.score);
    }, [topStudents]);

    const fetchTopStudents = () => {
        dispatch(getTopNStudents({ testId, limit }));
    };

    const exportToPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        // Set up fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Add title
        page.drawText(`Top ${limit} Students - Test ${testId}`, {
            x: 50,
            y: height - 50,
            font: boldFont,
            size: 18,
            color: rgb(0, 0, 0),
        });

        // Table parameters
        const startY = height - 80;
        const rowHeight = 20;
        const colWidths = [60, 200, 200, 80]; // Adjusted column widths
        const headers = ["Rank", "Name", "Email", "Score"];

        // Draw table headers
        let x = 50;
        headers.forEach((header, index) => {
            page.drawText(header, {
                x,
                y: startY,
                font: boldFont,
                size: 12,
                color: rgb(0, 0, 0),
            });
            x += colWidths[index];
        });

        // Draw table rows
        let currentY = startY - rowHeight;
        sortedStudents.forEach((student, index) => {
            const rowData = [
                `${index + 1}`,
                `${student.student.firstName} ${student.student.lastName}`,
                student.student.email,
                `${student.score}/${student.totalQuestions}`
            ];

            x = 50;
            rowData.forEach((text, colIndex) => {
                page.drawText(text, {
                    x,
                    y: currentY,
                    font,
                    size: 10,
                    color: rgb(0, 0, 0),
                    maxWidth: colWidths[colIndex] - 5,
                });
                x += colWidths[colIndex];
            });

            // Draw horizontal line
            page.drawLine({
                start: { x: 50, y: currentY - 5 },
                end: { x: width - 50, y: currentY - 5 },
                thickness: 0.5,
                color: rgb(0, 0, 0),
            });

            currentY -= rowHeight;
        });

        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `TopStudents_Test${testId}.pdf`;
        link.click();
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
                <Button
                    variant="outline"
                    onClick={exportToPDF}
                    disabled={isLoading || sortedStudents.length === 0}
                >
                    Export to PDF
                </Button>
            </div>

            {error && (
                <div className="mb-4 text-red-500">
                    Error: {typeof error === 'string' ? error : error.message}
                </div>
            )}
            <div id="pdf-content" className="pdf-export-content">
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
                                {sortedStudents.map((student, index) => (
                                    <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">
                                                {index + 1}. {student.student.firstName} {student.student.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{student.student.email}</p>
                                        </div>
                                        <div className="text-lg font-semibold">
                                            Score: {student.score}/{student.totalQuestions}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoading && sortedStudents.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No students found for this test
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QualifyStudents;