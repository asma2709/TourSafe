import { useEffect, useState } from 'react';
import { Package, DollarSign, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading, ErrorState, EmptyState } from '@/components/ui/States';
import { productService } from '@/services/api';
import type { Product } from '@/types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const typeIconMap: Record<string, string> = {
    'Digital Tourist Pass': '🎫',
    'Emergency Rescue Response': '🚨',
    'Satellite Tracker Lease': '📡',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Products & Services</h1>
        <p className="text-sm text-zinc-400 mt-1">Available products and services for tourists</p>
      </div>

      {loading ? (
        <Card className="p-4"><Loading /></Card>
      ) : error ? (
        <Card className="p-4"><ErrorState message={error} onRetry={load} /></Card>
      ) : products.length === 0 ? (
        <Card className="p-4"><EmptyState message="No products available" /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Card key={p.id} className="p-6 hover:border-purple-700/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-700/30">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
                <Badge status={p.type}>{p.type}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{p.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-purple-900/20">
                <span className="flex items-center gap-1 text-xl font-bold text-white">
                  <DollarSign size={18} className="text-emerald-400" />
                  {fmt(Number(p.price))}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Tag size={14} /> {typeIconMap[p.name] || '📦'} {p.type}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
