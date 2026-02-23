import { getDashboardData } from '@/lib/data';
import { DashboardClient } from './components/DashboardClient';

export default function Dashboard() {
  const data = getDashboardData();
  return <DashboardClient data={data} />;
}
