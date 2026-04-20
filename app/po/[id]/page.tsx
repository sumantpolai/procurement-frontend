'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Building2, Package, IndianRupee, FileText, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { PO, POStatus, Vendor } from '@/lib/types';

const statusColors: Record<POStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  partially_received: 'bg-blue-100 text-blue-800',
  received: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800',
};

export default function PODetailPage() {
  const params = useParams();
  const [po, setPo] = useState<PO | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPO();
  }, [params.id]);

  const loadPO = async () => {
    try {
      setLoading(true);
      const data = await api.po.getById(params.id as string);
      setPo(data);
      
      // Load vendor details
      if (data.vendor_id) {
        try {
          const vendorData = await api.vendors.getById(String(data.vendor_id));
          setVendor(vendorData);
        } catch (error) {
          console.error('Failed to load vendor:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load PO:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: POStatus) => {
    if (!po) return;
    try {
      await api.po.updateStatus(po.id, newStatus);
      loadPO();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount).replace('₹', '₹ ');
  };

  const calculateItemTotal = (item: any) => {
    const subtotal = Number(item.unit_price) * item.ordered_qty;
    const gstAmount = subtotal * (Number(item.gst_percent) / 100);
    return subtotal + gstAmount;
  };

  const calculateGrandTotal = () => {
    if (!po) return 0;
    return po.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading purchase order...</p>
        </div>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Purchase Order not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/po">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-green-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-800">{po.po_number}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Purchase Order Details</p>
                  </div>
                </div>
                <Badge className={statusColors[po.status] + ' text-sm px-3 py-1'}>
                  {po.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Vendor</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {vendor ? vendor.name : 'Loading...'}
                    </p>
                    {vendor && (
                      <p className="text-xs text-gray-500 mt-1">{vendor.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">PO Date</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(po.po_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">PO Type</p>
                    <Badge variant="outline" className="mt-1">{po.po_type}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Matching Type</p>
                    <Badge variant="outline" className="mt-1">{po.matching_type.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center text-gray-800">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Items
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {po.items.length} {po.items.length === 1 ? 'Item' : 'Items'}
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Item Name</TableHead>
                          <TableHead className="font-semibold">UOM</TableHead>
                          <TableHead className="text-right font-semibold">Qty</TableHead>
                          <TableHead className="text-right font-semibold">Unit Price</TableHead>
                          <TableHead className="text-right font-semibold">GST %</TableHead>
                          <TableHead className="text-right font-semibold">CGST %</TableHead>
                          <TableHead className="text-right font-semibold">SGST %</TableHead>
                          <TableHead className="text-right font-semibold">IGST %</TableHead>
                          <TableHead className="text-right font-semibold">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {po.items.map((item: any, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{item.item_name || 'N/A'}</TableCell>
                            <TableCell className="text-gray-600">{item.uom}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">{item.ordered_qty}</TableCell>
                            <TableCell className="text-right">{formatCurrency(Number(item.unit_price))}</TableCell>
                            <TableCell className="text-right">{Number(item.gst_percent)}%</TableCell>
                            <TableCell className="text-right">{Number(item.cgst_percent)}%</TableCell>
                            <TableCell className="text-right">{Number(item.sgst_percent)}%</TableCell>
                            <TableCell className="text-right">{Number(item.igst_percent)}%</TableCell>
                            <TableCell className="text-right font-semibold text-green-700">
                              {formatCurrency(calculateItemTotal(item))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold flex items-center text-gray-800">
                    <IndianRupee className="h-6 w-6 mr-2 text-green-600" />
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold text-green-700">
                    {formatCurrency(calculateGrandTotal())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-green-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-gray-800">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {po.status === 'draft' && (
                <Button
                  onClick={() => handleStatusUpdate('pending')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  Submit for Approval
                </Button>
              )}
              {po.status === 'pending' && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    Approve Order
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    className="w-full shadow-md"
                  >
                    Reject Order
                  </Button>
                </>
              )}
              {po.status === 'approved' && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate('partially_received')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    Mark Partially Received
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('received')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  >
                    Mark Fully Received
                  </Button>
                </>
              )}
              {(po.status === 'received' || po.status === 'partially_received') && (
                <Button
                  onClick={() => handleStatusUpdate('closed')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                >
                  Close PO
                </Button>
              )}
              {(po.status === 'rejected' || po.status === 'closed') && (
                <div className="text-center py-4 text-sm text-gray-500">
                  No actions available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-300 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800">Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {po.pr_id && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Linked PR</p>
                      <Link href={`/pr/${po.pr_id}`}>
                        <p className="font-medium text-blue-600 hover:underline mt-1">
                          View Purchase Request
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(po.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {po.updated_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(po.updated_at).toLocaleString('en-IN', {
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
