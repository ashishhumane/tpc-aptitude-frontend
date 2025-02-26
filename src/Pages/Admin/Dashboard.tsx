import DemoCalendar from "@/components/Calender";
import { ChartComponent } from "@/components/chart";
import { DemoAreaChart } from "@/components/Areachart";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-row gap-6">
        <ChartComponent />
        <DemoAreaChart />
      </div>
      <DemoCalendar />
    </div>
  );
};

export default Dashboard;
