import DemoCalendar from "@/components/Calender";
import { CarouselDemo } from "@/components/Carausel";

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <h1 className="text-4xl font-bold text-center ">
        TPC-PCE Aptitude Portal
      </h1>
      <CarouselDemo />
      <DemoCalendar />
    </div>
  );
};

export default Dashboard;
