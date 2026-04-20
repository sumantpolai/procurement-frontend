'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Package, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { PR, PRStatus } from '@/lib/types';

const statusColors: Record<PRStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function PRDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pr, setPr] = useState<PR | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPR();
  }, [params.id]);

  const loadPR = async () => {
    try {
      setLoading(true);
      const data = await api.pr.getById(params.id as string);
      setPr(data);
    } catch (error) {
      console.error('Failed to load PR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: PRStatus) => {
    if (!pr) return;
    try {
      await api.pr.updateStatus(pr.id, newStatus);
      loadPR();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading purchase request...</p>
        </div>
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Purchase Request not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/pr">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to PRs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-blue-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-800">{pr.pr_number}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Purchase Request Details</p>
                  </div>
                </div>
                <Badge className={statusColors[pr.status] + ' text-sm px-3 py-1'}>
                  {pr.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Requested By</p>
                    <p className="font-semibold text-gray-900 mt-1">{pr.requested_by}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created Date</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(pr.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center text-gray-800">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Items
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {pr.items.length} {pr.items.length === 1 ? 'Item' : 'Items'}
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Item Name</TableHead>
                        <TableHead className="font-semibold">UOM</TableHead>
                        <TableHead className="text-right font-semibold">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pr.items.map((item: any, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{item.item_name || 'N/A'}</TableCell>
                          <TableCell className="text-gray-600">{item.uom || 'N/A'}</TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-gray-800">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {pr.status === 'draft' && (
                <Button
                  onClick={() => handleStatusUpdate('submitted')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  Submit for Approval
                </Button>
              )}
              {pr.status === 'submitted' && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    className="w-full shadow-md"
                  >
                    Reject Request
                  </Button>
                </>
              )}
              {pr.status === 'approved' && (
                <Link href={`/po/create?pr_id=${pr.id}`} className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md">
                    Create Purchase Order
                  </Button>
                </Link>
              )}
              {pr.status === 'rejected' && (
                <div className="text-center py-4 text-sm text-gray-500">
                  This request has been rejected
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-300 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(pr.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {pr.updated_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(pr.updated_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
