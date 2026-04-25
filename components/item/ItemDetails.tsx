'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Tag,
  Layers,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  DRAFT: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Clock, label: 'DRAFT' },
  ACTIVE: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'ACTIVE' },
  INACTIVE: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'INACTIVE' },
};

interface ItemDetailsProps {
  itemId: string;
  backPath: string;
}

export default function ItemDetails({ itemId, backPath }: ItemDetailsProps) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.items.getById(itemId);
      setItem(data);
    } catch (err: any) {
      console.error('Failed to load item:', err);
      setError(err.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading item details...</p>
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(backPath)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Items
          </Button>
        </div>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              {error || 'Item not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[item.status?.toUpperCase()] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(backPath)}
          className="hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Items
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {item.name}
            </h1>
            <p className="text-gray-500 mt-0.5 font-mono text-sm">{item.code}</p>
          </div>
        </div>
        <Badge className={`${status.color} text-sm px-3 py-1 flex items-center gap-1.5 border`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card className="border-t-4 border-t-blue-500 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Info className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Item Code</p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono">{item.code}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Item Name</p>
                  <p className="font-semibold text-gray-900 mt-1">{item.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Layers className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Item Type</p>
                  <p className="font-semibold text-gray-900 mt-1 capitalize">
                    {item.item_type?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                  <p className="font-semibold text-gray-900 mt-1 capitalize">
                    {item.item_category}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Tag className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Unit of Measurement
                  </p>
                  <p className="font-semibold text-gray-900 mt-1 uppercase">{item.uom}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <StatusIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <Badge className={`${status.color} text-xs mt-1 border`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rejection Reason Card */}
        {item.rejection_reason && (
          <Card className="border-l-4 border-l-red-500 shadow-lg bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Rejection Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{item.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        {/* Audit Information Card */}
        <Card className="border-l-4 border-l-gray-300 shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              Audit Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 ring-4 ring-blue-100"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Created At</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-1.5 ring-4 ring-emerald-100"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Updated At</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {item.created_by && (
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full mt-1.5 ring-4 ring-indigo-100"></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created By</p>
                    <p className="font-medium text-gray-900 mt-1">{item.created_by}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}