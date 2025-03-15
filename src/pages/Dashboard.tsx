import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <DashboardCards />
      </div>
    </div>
  );
}
