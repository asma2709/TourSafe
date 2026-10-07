import { useEffect, useState } from 'react';
import { LifeBuoy, MapPin, DollarSign, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { rescueService } from '@/services/api';
import type { RescueResponse } from '@/types';

export function RescuePage() {
  const [responses, setResponses] = useState<RescueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rescueService.getAll();
      setResponses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rescue responses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Rescue Response</h1>
        <p className="text-sm text-zinc-400 mt-1">Track rescue operations and their status</p>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : responses.length === 0 ? (
          <EmptyState message="No rescue responses recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Rescue Team</th>
                  <th className="px-6 py-3 font-semibold">SOS Alert ID</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Est. Cost</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {responses.map((r) => (
                  <tr key={r.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="px-6 py-3 text-zinc-500">{r.id}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <LifeBuoy size={16} className="text-amber-500" />
                        <span className="font-medium text-white">{r.rescueTeam}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-zinc-400">#{r.sosAlertId}</td>
                    <td className="px-6 py-3 text-zinc-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-purple-400" />
                        {r.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-1 font-medium text-white">
                        <DollarSign size={14} className="text-purple-400" />
                        {fmt(Number(r.estimatedCost))}
                      </span>
                    </td>
                    <td className="px-6 py-3"><Badge status={r.status} /></td>
                    <td className="px-6 py-3 text-zinc-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-purple-400" />
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
