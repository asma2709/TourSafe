import { useEffect, useState } from 'react';
import {
  Users,
  Siren,
  ShieldCheck,
  LifeBuoy,
  TrendingUp,
  TrendingDown,
  Scale,
  Wallet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, StatCard } from '@/components/ui/Card';
import { Loading, ErrorState } from '@/components/ui/States';
import {
  touristService,
  sosService,
  safetyZoneService,
  rescueService,
  accountService,
  transactionService,
  budgetService,
} from '@/services/api';
import type { DashboardSummary, Account, Budget, SosAlert, SafetyZone, Tourist, RescueResponse, Transaction } from '@/types';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tourists, sos, zones, rescue, accounts, transactions, budgets] = await Promise.allSettled([
        touristService.getAll() as Promise<Tourist[]>,
        sosService.getAll() as Promise<SosAlert[]>,
        safetyZoneService.getAll() as Promise<SafetyZone[]>,
        rescueService.getAll() as Promise<RescueResponse[]>,
        accountService.getAll() as Promise<Account[]>,
        transactionService.getAll() as Promise<Transaction[]>,
        budgetService.getAll() as Promise<Budget[]>,
      ]);

      const get = <T,>(r: PromiseSettledResult<T[]>): T[] =>
        r.status === 'fulfilled' ? r.value : [];

      const touristList = get(tourists);
      const sosList = get(sos);
      const zoneList = get(zones);
      const rescueList = get(rescue);
      const accountList = get(accounts);
      const txnList = get(transactions);
      const budgetList = get(budgets);

      const totalIncome = accountList
        .filter((a) => a.accountType === 'INCOME')
        .reduce((sum, a) => sum + Number(a.balance), 0);
      const totalExpense = accountList
        .filter((a) => a.accountType === 'EXPENSE')
        .reduce((sum, a) => sum + Number(a.balance), 0);
      const totalBudget = budgetList.reduce((sum, b) => sum + Number(b.amount), 0);

      setSummary({
        totalTourists: touristList.length,
        activeSosAlerts: sosList.filter((s) => s.status?.toUpperCase() === 'ACTIVE').length,
        activeSafetyZones: zoneList.filter((z) => z.status?.toUpperCase() === 'ACTIVE').length,
        rescueResponses: rescueList.length,
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        totalBudget,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return null;

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const incomeExpenseData = [
    { name: 'Income', amount: summary.totalIncome },
    { name: 'Expense', amount: summary.totalExpense },
  ];

  const budgetData = [
    { name: 'Budget', amount: summary.totalBudget },
    { name: 'Spent', amount: summary.totalExpense },
    { name: 'Net', amount: summary.netBalance },
  ];

  const pieData = [
    { name: 'Income', value: summary.totalIncome },
    { name: 'Expense', value: summary.totalExpense },
  ];
  const pieColors = ['#a855f7', '#ef4444'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Overview of tourist safety and financial status</p>
      </div>

      {/* Safety cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tourists" value={summary.totalTourists} icon={<Users size={20} />} accent="bg-purple-600" />
        <StatCard title="Active SOS Alerts" value={summary.activeSosAlerts} icon={<Siren size={20} />} accent="bg-red-500" />
        <StatCard title="Active Safety Zones" value={summary.activeSafetyZones} icon={<ShieldCheck size={20} />} accent="bg-fuchsia-600" />
        <StatCard title="Rescue Responses" value={summary.rescueResponses} icon={<LifeBuoy size={20} />} accent="bg-violet-600" />
      </div>

      {/* Financial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Income" value={fmt(summary.totalIncome)} icon={<TrendingUp size={20} />} accent="bg-emerald-500" />
        <StatCard title="Total Expense" value={fmt(summary.totalExpense)} icon={<TrendingDown size={20} />} accent="bg-red-500" />
        <StatCard title="Net Balance" value={fmt(summary.netBalance)} icon={<Scale size={20} />} accent="bg-purple-600" />
        <StatCard title="Total Budget" value={fmt(summary.totalBudget)} icon={<Wallet size={20} />} accent="bg-violet-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={13} />
              <YAxis stroke="#a1a1aa" fontSize={13} />
              <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ background: '#18181b', border: '1px solid #6b21a8', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                <Cell fill="#a855f7" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={13} />
              <YAxis stroke="#a1a1aa" fontSize={13} />
              <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ background: '#18181b', border: '1px solid #6b21a8', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Income / Expense Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={{ fill: '#a1a1aa' }}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ background: '#18181b', border: '1px solid #6b21a8', borderRadius: '8px', color: '#fff' }} />
            <Legend wrapperStyle={{ color: '#a1a1aa' }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
