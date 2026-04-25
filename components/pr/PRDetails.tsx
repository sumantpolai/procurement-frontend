'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  User,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  ShoppingCart,
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
import { PRStatus } from '@/lib/types';

const statusConfig: Record<PRStatus, { color: string; icon: React.ElementType; label: string }> = {
  draft: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Clock, label: 'DRAFT' },
  submitted: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Send, label: 'SUBMITTED' },
  approved: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'APPROVED' },
  rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, label: 'REJECTED' },
};

interface PRDetailsProps {
  prId: string;
  backPath: string;
  canUpdateStatus?: boolean;
  canCreatePO?: boolean;
  readOnly?: boolean;
}

export default function PRDetails({
  prId,
  backPath,
  canUpdateStatus = false,
  canCreatePO = false,
  readOnly = false,
}: PRDetailsProps) {
  const router = useRouter();
  const [pr, setPr] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPR();
  }, [prId]);

  const loadPR = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.pr.getById(prId);
      setPr(data);
    } catch (err: any) {
      console.error('Failed to load PR:', err);
      setError(err.message || 'Failed to load purchase requisition');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: PRStatus) => {
    if (!pr || !canUpdateStatus) return;
    try {
      setUpdating(true);
      await api.pr.updateStatus(pr.id, newStatus);
      await loadPR();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading purchase requisition...</p>
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (error || !pr) {
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
            Back to PRs
          </Button>
        </div>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              {error || 'Purchase requisition not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[pr.status as PRStatus] || statusConfig.draft;
  const StatusIcon = status.icon;

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
          Back to PRs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* PR Header Card */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-800">
                      {pr.pr_number}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Purchase Requisition Details
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
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Requested By
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {pr.requested_by}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Created Date
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(pr.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center text-gray-800">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Items
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {pr.items?.length || 0}{' '}
                    {(pr.items?.length || 0) === 1 ? 'Item' : 'Items'}
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">#</TableHead>
                        <TableHead className="font-semibold">Item Name</TableHead>
                        <TableHead className="font-semibold">UOM</TableHead>
                        <TableHead className="text-right font-semibold">
                          Quantity
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pr.items && pr.items.length > 0 ? (
                        pr.items.map((item: any, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="text-gray-500">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.item_name || item.item_id || 'N/A'}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {item.uom || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-blue-600">
                              {item.quantity}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-gray-500"
                          >
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-6">
          {/* Actions Card */}
          {!readOnly && (canUpdateStatus || canCreatePO) && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-gray-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {canUpdateStatus && pr.status === 'draft' && (
                  <Button
                    onClick={() => handleStatusUpdate('submitted')}
                    disabled={updating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {updating ? 'Updating...' : 'Submit for Approval'}
                  </Button>
                )}
                {canUpdateStatus && pr.status === 'submitted' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Approve Request'}
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updating}
                      variant="destructive"
                      className="w-full shadow-md transition-all"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Reject Request'}
                    </Button>
                  </>
                )}
                {canCreatePO && pr.status === 'approved' && (
                  <Button
                    onClick={() =>
                      router.push(
                        `${backPath.replace(/\/purchase-requisitions.*/, '/purchase-orders/create')}?pr_id=${pr.id}`
                      )
                    }
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Create Purchase Order
                  </Button>
                )}
                {pr.status === 'rejected' && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    This request has been rejected
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
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Created
                    </p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(pr.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {pr.updated_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-1.5 ring-4 ring-emerald-100"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Last Updated
                      </p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(pr.updated_at).toLocaleString('en-IN', {
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

          {/* Status Info Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800 text-sm">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">PR Number</span>
                  <span className="font-semibold">{pr.pr_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Items</span>
                  <span className="font-semibold">{pr.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
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