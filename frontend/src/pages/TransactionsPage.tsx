import { useEffect, useState } from 'react';
import { Plus, ArrowLeftRight, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { transactionService, accountService } from '@/services/api';
import type { Transaction, Account } from '@/types';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: 'INCOME',
    description: '',
    amount: '',
    accountId: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txnData, acctData] = await Promise.allSettled([
        transactionService.getAll(),
        accountService.getAll(),
      ]);
      setTransactions(txnData.status === 'fulfilled' ? txnData.value : []);
      setAccounts(acctData.status === 'fulfilled' ? acctData.value : []);
      if (txnData.status === 'rejected') throw txnData.reason;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
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
      await transactionService.create({
        type: form.type,
        description: form.description,
        amount: parseFloat(form.amount),
        accountId: parseInt(form.accountId) || 0,
        transactionDate: form.transactionDate,
      });
      toast('Transaction added successfully');
      setShowForm(false);
      setForm({ type: 'INCOME', description: '', amount: '', accountId: '', transactionDate: new Date().toISOString().split('T')[0] });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to add transaction', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-zinc-400 mt-1">Record income and expense transactions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Transaction
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : transactions.length === 0 ? (
          <EmptyState message="No transactions recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                  <th className="px-6 py-3 font-semibold">Account</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-500">{t.id}</td>
                    <td className="px-6 py-3"><Badge status={t.type} /></td>
                    <td className="px-6 py-3 text-zinc-200">{t.description}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`font-semibold ${t.type?.toUpperCase() === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.type?.toUpperCase() === 'INCOME' ? '+' : '-'}{fmt(Number(t.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-400">{t.accountName || `Account #${t.accountId}`}</td>
                    <td className="px-6 py-3 text-zinc-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-purple-400" />
                        {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showForm} title="Add Transaction" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit}>
          <Field label="Transaction Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Select>
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} placeholder="Transaction description" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount">
              <Input type="number" step="any" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required placeholder="0.00" />
            </Field>
            <Field label="Date">
              <Input type="date" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} required />
            </Field>
          </div>
          <Field label="Account">
            <Select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} required>
              <option value="">Select an account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.accountName} ({a.accountType})</option>
              ))}
            </Select>
          </Field>
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Transaction'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
