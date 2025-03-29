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

    // Process students to get unique entries with highest scores
    const sortedStudents = useMemo(() => {
        const uniqueStudents = topStudents.reduce((acc, current) => {
            const existing = acc.get(current.student.id);
            if (!existing || current.score > existing.score) {
                acc.set(current.student.id, current);
            }
            return acc;
        }, new Map<number, typeof topStudents[0]>());

        return Array.from(uniqueStudents.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }, [topStudents, limit]);

    const fetchTopStudents = () => {
        dispatch(getTopNStudents({ testId, limit }));
    };

    const exportToPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const pageHeight = 792; // Standard A4 height (11 inches * 72 dpi)
        const rowHeight = 20;
        const margin = 50;
        
        // Set up fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
        let currentPage = pdfDoc.addPage();
        let currentY = pageHeight - margin - 30; // Initial Y position
        
        // Add main title (only on first page)
        currentPage.drawText(`Top ${limit} Students - Test ${testId}`, {
            x: margin,
            y: currentY,
            font: boldFont,
            size: 18,
            color: rgb(0, 0, 0),
        });
        currentY -= 40;
    
        // Table parameters
        const colWidths = [60, 200, 200, 80];
        const headers = ["Rank", "Name", "Email", "Score"];
        let isFirstPage = true;
    
        // Draw headers on first page
        let x = margin;
        headers.forEach((header, index) => {
            currentPage.drawText(header, {
                x,
                y: currentY,
                font: boldFont,
                size: 12,
                color: rgb(0, 0, 0),
            });
            x += colWidths[index];
        });
        currentY -= rowHeight + 5;
    
        // Draw table rows
        sortedStudents.forEach((student, index) => {
            // Check if need new page (leave space for header)
            if (currentY < margin + 50) {
                currentPage = pdfDoc.addPage();
                currentY = pageHeight - margin - 30;
                isFirstPage = false;
    
                // Draw headers on new page
                x = margin;
                headers.forEach((header, index) => {
                    currentPage.drawText(header, {
                        x,
                        y: currentY,
                        font: boldFont,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                    x += colWidths[index];
                });
                currentY -= rowHeight + 5;
            }
    
            const rowData = [
                `${index + 1}`,
                `${student.student.firstName} ${student.student.lastName}`,
                student.student.email,
                `${student.score}/${student.totalQuestions}`
            ];
    
            // Draw row content
            x = margin;
            rowData.forEach((text, colIndex) => {
                currentPage.drawText(text, {
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
            currentPage.drawLine({
                start: { x: margin, y: currentY - 5 },
                end: { x: currentPage.getWidth() - margin, y: currentY - 5 },
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
    );
};

export default QualifyStudents;