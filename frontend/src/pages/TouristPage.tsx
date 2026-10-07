import { useEffect, useState } from 'react';
import { UserPlus, Eye, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { touristService } from '@/services/api';
import type { Tourist } from '@/types';

export function TouristPage() {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewTourist, setViewTourist] = useState<Tourist | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', passType: 'STANDARD' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await touristService.getAll();
      setTourists(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tourists');
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
      await touristService.create(form);
      toast('Tourist added successfully');
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', passType: 'STANDARD' });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to add tourist', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tourist Management</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage registered tourists</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus size={18} /> Add Tourist
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : tourists.length === 0 ? (
          <EmptyState message="No tourists registered yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Phone</th>
                  <th className="px-6 py-3 font-semibold">Pass Type</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {tourists.map((t) => (
                  <tr key={t.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-500">{t.id}</td>
                    <td className="px-6 py-3 font-medium text-white">{t.name}</td>
                    <td className="px-6 py-3 text-zinc-400">{t.email}</td>
                    <td className="px-6 py-3 text-zinc-400">{t.phone}</td>
                    <td className="px-6 py-3"><Badge status={t.passType}>{t.passType}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewTourist(t)}>
                        <Eye size={16} /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showForm} title="Add Tourist" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit}>
          <Field label="Full Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="john@example.com" />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+1 234 567 890" />
          </Field>
          <Field label="Pass Type">
            <Select value={form.passType} onChange={(e) => setForm({ ...form, passType: e.target.value })}>
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="VIP">VIP</option>
            </Select>
          </Field>
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Tourist'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewTourist} title="Tourist Details" onClose={() => setViewTourist(null)}>
        {viewTourist && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-700/30">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{viewTourist.name}</p>
                <p className="text-sm text-zinc-500">ID: {viewTourist.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-zinc-500">Email</p><p className="text-sm font-medium text-zinc-200">{viewTourist.email}</p></div>
              <div><p className="text-xs text-zinc-500">Phone</p><p className="text-sm font-medium text-zinc-200">{viewTourist.phone}</p></div>
              <div><p className="text-xs text-zinc-500">Pass Type</p><div className="mt-1"><Badge status={viewTourist.passType} /></div></div>
              {viewTourist.createdAt && (
                <div><p className="text-xs text-zinc-500">Registered</p><p className="text-sm font-medium text-zinc-200">{new Date(viewTourist.createdAt).toLocaleDateString()}</p></div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
