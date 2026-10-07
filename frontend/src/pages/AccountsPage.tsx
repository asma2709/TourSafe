import { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { accountService } from '@/services/api';
import type { Account } from '@/types';

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ accountName: '', accountType: 'ASSET', balance: '' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountService.getAll();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
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
      await accountService.create({
        accountName: form.accountName,
        accountType: form.accountType,
        balance: parseFloat(form.balance) || 0,
      });
      toast('Account created successfully');
      setShowForm(false);
      setForm({ accountName: '', accountType: 'ASSET', balance: '' });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Chart of Accounts</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage financial accounts</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Account
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : accounts.length === 0 ? (
          <EmptyState message="No accounts found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Account Name</th>
                  <th className="px-6 py-3 font-semibold">Account Type</th>
                  <th className="px-6 py-3 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {accounts.map((a) => (
                  <tr key={a.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-500">{a.id}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-400" />
                        <span className="font-medium text-white">{a.accountName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3"><Badge status={a.accountType} /></td>
                    <td className="px-6 py-3 text-right font-semibold text-white">{fmt(Number(a.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showForm} title="Add Account" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit}>
          <Field label="Account Name">
            <Input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} required placeholder="Cash Account" />
          </Field>
          <Field label="Account Type">
            <Select value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
              <option value="ASSET">Asset</option>
              <option value="LIABILITY">Liability</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Select>
          </Field>
          <Field label="Opening Balance">
            <Input type="number" step="any" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} placeholder="0.00" />
          </Field>
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Account'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
