import { useEffect, useState } from 'react';
import { Plus, ShieldCheck, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { safetyZoneService } from '@/services/api';
import type { SafetyZone } from '@/types';

export function SafetyZonePage() {
  const [zones, setZones] = useState<SafetyZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [geofenceResult, setGeofenceResult] = useState<Record<number, 'inside' | 'outside'>>({});
  const [form, setForm] = useState({
    zoneName: '',
    latitude: '',
    longitude: '',
    radius: '',
    status: 'ACTIVE',
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safetyZoneService.getAll();
      setZones(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load safety zones');
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
      await safetyZoneService.create({
        zoneName: form.zoneName,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        radius: parseFloat(form.radius),
        status: form.status,
      });
      toast('Safety zone added successfully');
      setShowForm(false);
      setForm({ zoneName: '', latitude: '', longitude: '', radius: '', status: 'ACTIVE' });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to add safety zone', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const checkGeofence = async (zone: SafetyZone) => {
    try {
      const result = await safetyZoneService.checkGeofence(0, zone.latitude, zone.longitude);
      setGeofenceResult((prev) => ({
        ...prev,
        [zone.id]: typeof result === 'boolean' ? (result ? 'inside' : 'outside') : result?.inside ? 'inside' : 'outside',
      }));
    } catch {
      setGeofenceResult((prev) => ({ ...prev, [zone.id]: 'outside' }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Safety Zones</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage geo-fenced safety areas</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Zone
        </Button>
      </div>

      {loading ? (
        <Card className="p-4"><Loading /></Card>
      ) : error ? (
        <Card className="p-4"><ErrorState message={error} onRetry={load} /></Card>
      ) : zones.length === 0 ? (
        <Card className="p-4"><EmptyState message="No safety zones defined" /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const isActive = zone.status?.toUpperCase() === 'ACTIVE';
            const geofence = geofenceResult[zone.id];
            return (
              <Card key={zone.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                      <ShieldCheck className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{zone.zoneName}</h3>
                      <p className="text-xs text-zinc-500">ID: {zone.id}</p>
                    </div>
                  </div>
                  <Badge status={zone.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin size={14} className="text-purple-400" />
                    <span className="font-mono text-xs">{zone.latitude}, {zone.longitude}</span>
                  </div>
                  <div className="text-zinc-400">Radius: <span className="font-medium text-zinc-200">{zone.radius}m</span></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="secondary" size="sm" onClick={() => checkGeofence(zone)}>
                    Check Geofence
                  </Button>
                  {geofence && (
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${geofence === 'inside' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {geofence === 'inside' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {geofence === 'inside' ? 'Inside' : 'Outside'}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showForm} title="Add Safety Zone" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit}>
          <Field label="Zone Name">
            <Input value={form.zoneName} onChange={(e) => setForm({ ...form, zoneName: e.target.value })} required placeholder="Downtown Tourist Area" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude">
              <Input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required placeholder="40.7128" />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required placeholder="-74.0060" />
            </Field>
          </div>
          <Field label="Radius (meters)">
            <Input type="number" value={form.radius} onChange={(e) => setForm({ ...form, radius: e.target.value })} required placeholder="500" />
          </Field>
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Zone'}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
