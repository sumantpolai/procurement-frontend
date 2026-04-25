'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Package,
  FileText,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Receipt,
  IndianRupee,
  Hash,
  Layers,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/services/api';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  draft: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Clock, label: 'DRAFT' },
  pending: { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Send, label: 'PENDING' },
  approved: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'APPROVED' },
  rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'REJECTED' },
  partially_received: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Package, label: 'PARTIALLY RECEIVED' },
  received: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'RECEIVED' },
  closed: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: XCircle, label: 'CLOSED' },
  completed: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: CheckCircle, label: 'COMPLETED' },
};

interface PODetailsProps {
  poId: string;
  backPath: string;
  canUpdateStatus?: boolean;
  readOnly?: boolean;
}

export default function PODetails({
  poId,
  backPath,
  canUpdateStatus = false,
  readOnly = false,
}: PODetailsProps) {
  const router = useRouter();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPO();
  }, [poId]);

  const loadPO = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.po.getById(poId);
      setPo(data);
    } catch (err: any) {
      console.error('Failed to load PO:', err);
      setError(err.message || 'Failed to load purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!po || !canUpdateStatus) return;
    try {
      setUpdating(true);
      await api.po.updateStatus(po.id, newStatus);
      await loadPO();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const calculateLineTotal = (item: any) => {
    const baseAmount = (item.ordered_qty || 0) * parseFloat(item.unit_price || 0);
    const gstAmount = baseAmount * (parseFloat(item.gst_percent || 0) / 100);
    return baseAmount + gstAmount;
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading purchase order...</p>
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (error || !po) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(backPath)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POs
          </Button>
        </div>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              {error || 'Purchase order not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[po.status?.toLowerCase()] || statusConfig.draft;
  const StatusIcon = status.icon;
  const totalAmount = po.total_amount
    ? parseFloat(po.total_amount).toFixed(2)
    : po.items?.reduce((sum: number, item: any) => sum + calculateLineTotal(item), 0).toFixed(2) || '0.00';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(backPath)}
          className="hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to POs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* PO Header Card */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-800">
                      {po.po_number}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Purchase Order Details
                    </p>
                  </div>
                </div>
                <Badge className={`${status.color} text-sm px-3 py-1 flex items-center gap-1.5 border`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Vendor</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {po.vendor_name || po.vendor_id || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">PO Date</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {po.po_date
                        ? new Date(po.po_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">PO Type</p>
                    <p className="font-semibold text-gray-900 mt-1 capitalize">
                      {po.po_type?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Hash className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Matching Type</p>
                    <p className="font-semibold text-gray-900 mt-1 capitalize">
                      {po.matching_type?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                </div>
                {po.pr_id && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Linked PR</p>
                      <p className="font-semibold text-gray-900 mt-1 font-mono text-sm">
                        {po.pr_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center text-gray-800">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Order Items
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {po.items?.length || 0}{' '}
                    {(po.items?.length || 0) === 1 ? 'Item' : 'Items'}
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">#</TableHead>
                          <TableHead className="font-semibold">Item ID</TableHead>
                          <TableHead className="font-semibold text-right">Qty</TableHead>
                          <TableHead className="font-semibold text-right">Unit Price</TableHead>
                          <TableHead className="font-semibold text-right">GST %</TableHead>
                          <TableHead className="font-semibold">UOM</TableHead>
                          <TableHead className="font-semibold">HSN</TableHead>
                          <TableHead className="font-semibold text-right">Line Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {po.items && po.items.length > 0 ? (
                          po.items.map((item: any, index: number) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="text-gray-500">{index + 1}</TableCell>
                              <TableCell className="font-mono text-sm max-w-[200px] truncate">
                                {item.item_id || 'N/A'}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {item.ordered_qty}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{parseFloat(item.unit_price || 0).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                {parseFloat(item.gst_percent || 0).toFixed(1)}%
                              </TableCell>
                              <TableCell className="uppercase">{item.uom || 'N/A'}</TableCell>
                              <TableCell>{item.hsn_code || '—'}</TableCell>
                              <TableCell className="text-right font-semibold text-blue-600">
                                ₹{calculateLineTotal(item).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              No items found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-end mt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 min-w-[250px]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4" />
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-6">
          {/* Actions Card */}
          {!readOnly && canUpdateStatus && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-gray-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {(po.status === 'draft' || po.status === 'pending') && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Approve Order'}
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updating}
                      variant="destructive"
                      className="w-full shadow-md transition-all"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Reject Order'}
                    </Button>
                  </>
                )}
                {po.status === 'approved' && (
                  <Button
                    onClick={() => handleStatusUpdate('closed')}
                    disabled={updating}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
                  >
                    {updating ? 'Updating...' : 'Close Order'}
                  </Button>
                )}
                {(po.status === 'rejected' || po.status === 'closed') && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    This order has been {po.status}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="border-l-4 border-l-gray-300 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 ring-4 ring-blue-100"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {po.created_at
                        ? new Date(po.created_at).toLocaleString('en-IN', {
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
                {po.updated_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-1.5 ring-4 ring-emerald-100"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(po.updated_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800 text-sm">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">PO Number</span>
                  <span className="font-semibold">{po.po_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Items</span>
                  <span className="font-semibold">{po.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PO Type</span>
                  <span className="font-semibold capitalize">
                    {po.po_type?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold text-blue-700">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <Badge className={`${status.color} text-xs border`}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
