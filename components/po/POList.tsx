'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

interface POListProps {
  basePath: string;
  canCreate?: boolean;
  readOnly?: boolean;
}

export default function POList({ basePath, canCreate = true, readOnly = false }: POListProps) {
  const router = useRouter();
  const [pos, setPOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPOs();
  }, [page, statusFilter]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadPOs();
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadPOs = async () => {
    try {
      setLoading(true);
      const response = await api.po.getAll(page, 10, statusFilter);
      setPOs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load POs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPOs();
      return;
    }
    try {
      setLoading(true);
      const response = await api.po.search(searchQuery);
      
      if (response.data && Array.isArray(response.data)) {
        setPOs(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setPOs([response]);
        setTotal(1);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setPOs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Purchase Orders
          </h1>
          <p className="text-gray-600 mt-1">
            {readOnly ? 'View all purchase orders (Read Only)' : 'Manage and track all purchase orders'}
          </p>
        </div>
        {canCreate && !readOnly && (
          <Button 
            onClick={() => router.push(`${basePath}/create`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        )}
        {/* {readOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Read Only Access</span>
          </div>
        )} */}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search by PO number (e.g., PO-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <select
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : pos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No purchase orders found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>PO Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pos.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.po_number || 'N/A'}</TableCell>
                        <TableCell>{po.vendor_name || po.vendor_id || 'N/A'}</TableCell>
                        <TableCell>{po.items?.length || 0} items</TableCell>
                        <TableCell className="font-semibold">
                          ₹{po.total_amount ? parseFloat(po.total_amount).toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell>
                          {po.status ? (
                            <Badge className={statusColors[po.status.toLowerCase()]}>
                              {po.status.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">UNKNOWN</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {po.po_date ? new Date(po.po_date).toLocaleDateString('en-IN') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`${basePath}/${po.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / 10)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 10)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
