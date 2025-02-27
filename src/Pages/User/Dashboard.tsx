import DemoCalendar from "@/components/Calender";
import { CarouselDemo } from "@/components/Carausel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const topStudents = [
  { rank: 1, name: "John Doe", marks: 98 },
  { rank: 2, name: "Alice Smith", marks: 95 },
  { rank: 3, name: "Michael Brown", marks: 92 },
  { rank: 4, name: "Emily Johnson", marks: 90 },
  { rank: 5, name: "David Wilson", marks: 89 },
  { rank: 6, name: "Sophia Martinez", marks: 88 },
  { rank: 7, name: "James Anderson", marks: 86 },
  { rank: 8, name: "Olivia Taylor", marks: 85 },
  { rank: 9, name: "William Harris", marks: 83 },
  { rank: 10, name: "Emma White", marks: 82 },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <h1 className="text-4xl font-bold text-center">
        TPC-PCE Aptitude Portal
      </h1>

      <div className="flex gap-6">
        {/* Carousel */}
        <div className="flex-1">
          <CarouselDemo />
        </div>
        {/* Scrollable Top Scorers Section */}
        <ScrollArea className="w-1/4 h-96 border rounded-lg shadow-md p-4 bg-white dark:bg-black">
          <h2 className="text-lg font-semibold mb-2">🏆 Top 10 Scorers</h2>
          <ul className="space-y-2">
            {topStudents.map((student) => (
              <Card key={student.rank} className="p-3 flex justify-between">
                <span className="font-medium">
                  {student.rank}. {student.name}
                </span>
                <span className="font-bold text-blue-600">{student.marks}</span>
              </Card>
            ))}
          </ul>
        </ScrollArea>
      </div>

      {/* Calendar */}
      <DemoCalendar />
    </div>
  );
};

export default Dashboard;
