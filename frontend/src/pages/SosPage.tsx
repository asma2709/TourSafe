import { useEffect, useState } from 'react';
import { Siren, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { sosService } from '@/services/api';
import type { SosAlert } from '@/types';

export function SosPage() {
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sosService.getAll();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SOS alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">SOS / Emergency Alerts</h1>
        <p className="text-sm text-zinc-400 mt-1">Monitor and respond to emergency alerts</p>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : alerts.length === 0 ? (
          <EmptyState message="No SOS alerts found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-950/30 text-purple-300 text-left border-b border-purple-900/30">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Tourist ID</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Coordinates</th>
                  <th className="px-6 py-3 font-semibold">Message</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {alerts.map((a) => {
                  const isActive = a.status?.toUpperCase() === 'ACTIVE';
                  return (
                    <tr
                      key={a.id}
                      className={`transition-colors ${isActive ? 'bg-red-500/10 hover:bg-red-500/20' : 'hover:bg-purple-950/30'}`}
                    >
                      <td className="px-6 py-3 text-zinc-500">{a.id}</td>
                      <td className="px-6 py-3 font-medium text-white">
                        {a.touristName || a.touristId}
                      </td>
                      <td className="px-6 py-3 text-zinc-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-purple-400" />
                          {a.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-zinc-400 text-xs font-mono">
                        {a.latitude}, {a.longitude}
                      </td>
                      <td className="px-6 py-3 text-zinc-400 max-w-xs truncate">
                        {a.message || '—'}
                      </td>
                      <td className="px-6 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <Badge status={a.status} />
                          </span>
                        ) : (
                          <Badge status={a.status} />
                        )}
                      </td>
                      <td className="px-6 py-3 text-zinc-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-purple-400" />
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {alerts.some((a) => a.status?.toUpperCase() === 'ACTIVE') && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300 font-medium">
            {alerts.filter((a) => a.status?.toUpperCase() === 'ACTIVE').length} active SOS alert(s) require immediate attention
          </p>
        </div>
      )}
    </div>
  );
}
