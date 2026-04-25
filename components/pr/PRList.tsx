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
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

interface PRListProps {
  basePath: string;
  canCreate?: boolean;
  readOnly?: boolean;
}

export default function PRList({ basePath, canCreate = true, readOnly = false }: PRListProps) {
  const router = useRouter();
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPRs();
  }, [page, statusFilter]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadPRs();
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadPRs = async () => {
    try {
      setLoading(true);
      const response = await api.pr.getAll(page, 10, statusFilter);
      setPrs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load PRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPRs();
      return;
    }
    try {
      setLoading(true);
      const response = await api.pr.search(searchQuery);
      
      if (response.data && Array.isArray(response.data)) {
        setPrs(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setPrs([response]);
        setTotal(1);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setPrs([]);
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
            Purchase Requisitions
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all purchase requisitions</p>
        </div>
        {canCreate && (
          <Button 
            onClick={() => router.push(`${basePath}/create`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create PR
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search by PR number (e.g., PR-001)"
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
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Requisitions ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : prs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No purchase requisitions found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PR Number</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prs.map((pr) => (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">{pr.pr_number || 'N/A'}</TableCell>
                        <TableCell>{pr.requested_by || 'N/A'}</TableCell>
                        <TableCell>{pr.items?.length || 0} items</TableCell>
                        <TableCell>
                          {pr.status ? (
                            <Badge className={statusColors[pr.status]}>
                              {pr.status.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">UNKNOWN</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {pr.created_at ? new Date(pr.created_at).toLocaleDateString('en-IN') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`${basePath}/${pr.id}`)}
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
