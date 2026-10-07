import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Wallet,
  Download,
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
import { Button } from '@/components/ui/Button';
import { Loading, ErrorState } from '@/components/ui/States';
import { reportService, budgetService, transactionService } from '@/services/api';
import type { FinancialReport } from '@/types';

export function ReportsPage() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [budgets, setBudgets] = useState<{ category: string; amount: number }[]>([]);
  const [transactions, setTransactions] = useState<{ type: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportResult, budgetResult, txnResult] = await Promise.allSettled([
        reportService.getFinancial(),
        budgetService.getAll(),
        transactionService.getAll(),
      ]);

      const reportData = reportResult.status === 'fulfilled' ? reportResult.value : null;
      const budgetData = budgetResult.status === 'fulfilled' ? budgetResult.value : [];
      const txnData = txnResult.status === 'fulfilled' ? txnResult.value : [];

      if (reportData) {
        setReport(reportData);
      } else {
        // Fallback: compute from transactions
        const income = txnData
          .filter((t: { type: string }) => t.type?.toUpperCase() === 'INCOME')
          .reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);
        const expense = txnData
          .filter((t: { type: string }) => t.type?.toUpperCase() === 'EXPENSE')
          .reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);
        const totalBudget = budgetData.reduce((s: number, b: { amount: number }) => s + Number(b.amount), 0);
        setReport({
          totalIncome: income,
          totalExpense: expense,
          netBalance: income - expense,
          totalBudget,
        });
      }

      setBudgets(budgetData.map((b: { category: string; amount: number }) => ({ category: b.category, amount: Number(b.amount) })));
      setTransactions(
        txnData.reduce((acc: { type: string; amount: number }[], t: { type: string; amount: number }) => {
          const existing = acc.find((a) => a.type === t.type);
          if (existing) {
            existing.amount += Number(t.amount);
          } else {
            acc.push({ type: t.type, amount: Number(t.amount) });
          }
          return acc;
        }, [])
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!report) return null;

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const incomeExpenseData = [
    { name: 'Income', amount: report.totalIncome },
    { name: 'Expense', amount: report.totalExpense },
  ];

  const pieData = [
    { name: 'Income', value: report.totalIncome },
    { name: 'Expense', value: report.totalExpense },
    { name: 'Budget', value: report.totalBudget },
  ];
  const pieColors = ['#a855f7', '#ef4444', '#8b5cf6'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Report</h1>
          <p className="text-sm text-zinc-400 mt-1">Summary of financial performance</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download size={18} /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Income" value={fmt(report.totalIncome)} icon={<TrendingUp size={20} />} accent="bg-emerald-500" />
        <StatCard title="Total Expense" value={fmt(report.totalExpense)} icon={<TrendingDown size={20} />} accent="bg-red-500" />
        <StatCard title="Net Balance" value={fmt(report.netBalance)} icon={<Scale size={20} />} accent="bg-purple-600" />
        <StatCard title="Total Budget" value={fmt(report.totalBudget)} icon={<Wallet size={20} />} accent="bg-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          <h3 className="text-lg font-semibold text-white mb-4">Financial Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
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

      {budgets.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Budget by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={budgets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="category" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={13} />
              <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ background: '#18181b', border: '1px solid #6b21a8', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <span className="text-sm font-medium text-emerald-300">Total Income</span>
            <span className="text-lg font-bold text-emerald-200">{fmt(report.totalIncome)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="text-sm font-medium text-red-300">Total Expense</span>
            <span className="text-lg font-bold text-red-200">{fmt(report.totalExpense)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span className="text-sm font-medium text-purple-300">Net Balance</span>
            <span className="text-lg font-bold text-purple-200">{fmt(report.netBalance)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <span className="text-sm font-medium text-violet-300">Total Budget</span>
            <span className="text-lg font-bold text-violet-200">{fmt(report.totalBudget)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
