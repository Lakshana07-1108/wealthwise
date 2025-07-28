import { OverviewCards } from "@/components/dashboard/overview-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AiInsights from "@/components/dashboard/ai-insights";

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCards />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SpendingChart />
        </div>
        <div>
          <AiInsights />
        </div>
      </div>
       <RecentTransactions />
    </>
  );
}
