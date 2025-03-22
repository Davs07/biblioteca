import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentBooks } from "@/components/dashboard/recent-books"
import { CategoryOverview } from "@/components/dashboard/category-overview"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RecentBooks />
        <CategoryOverview />
      </div>
    </div>
  )
}

