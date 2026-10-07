import { useEffect, useState } from 'react';
import { Plus, Wallet, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select } from '@/components/ui/Form';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { budgetService } from '@/services/api';
import type { Budget } from '@/types';

export function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: '', amount: '', year: String(new Date().getFullYear()) });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await budgetService.getAll();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await budgetService.create({
        category: form.category,
        amount: parseFloat(form.amount),
        year: parseInt(form.year),
      });
      toast('Budget added successfully');
      setShowForm(false);
      setForm({ category: '', amount: '', year: String(new Date().getFullYear()) });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to add budget', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget</h1>
          <p className="text-sm text-zinc-400 mt-1">Plan and track annual budgets</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-700/30">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Budget</p>
              <p className="text-xl font-bold text-white">{fmt(totalBudget)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-700/30">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Categories</p>
              <p className="text-xl font-bold text-white">{budgets.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-700/30">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Years Covered</p>
              <p className="text-xl font-bold text-white">{new Set(budgets.map((b) => b.year)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : budgets.length === 0 ? (
          <EmptyState message="No budgets defined" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                  <th className="px-6 py-3 font-semibold">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {budgets.map((b) => (
                  <tr key={b.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-500">{b.id}</td>
                    <td className="px-6 py-3 font-medium text-white">{b.category}</td>
                    <td className="px-6 py-3 text-right font-semibold text-white">{fmt(Number(b.amount))}</td>
                    <td className="px-6 py-3 text-zinc-400">{b.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showForm} title="Add Budget" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit}>
          <Field label="Category">
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="Equipment" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount">
              <Input type="number" step="any" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required placeholder="5000" />
            </Field>
            <Field label="Year">
              <Select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - 1 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </Select>
            </Field>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Budget'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
