'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { Vendor } from '@/lib/types';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await api.vendors.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadVendors();
      return;
    }

    try {
      const data = await api.vendors.search(query);
      setVendors(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await api.vendors.delete(id);
      loadVendors();
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  const openStatusModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setNewStatus(vendor.status);
    setApprovedBy('');
    setRejectedReason('');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedVendor) return;

    if (newStatus === 'approved' && !approvedBy.trim()) {
      alert('Please enter approved by name');
      return;
    }

    if (newStatus === 'rejected' && !rejectedReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    try {
      setUpdatingStatus(true);
      await api.vendors.updateStatus(
        selectedVendor.id,
        newStatus,
        newStatus === 'approved' ? approvedBy : undefined,
        newStatus === 'rejected' ? rejectedReason : undefined
      );
      setStatusModalOpen(false);
      loadVendors();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update vendor status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="border-t-4 border-t-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-gray-800">Vendor Master</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Manage vendor information</p>
            </div>
            <Link href="/vendors/create">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 border-gray-300 focus:border-purple-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No vendors found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(vendor.status)}>
                          {vendor.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.bank_details.bank_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStatusModal(vendor)}
                            className="text-purple-600 hover:bg-purple-50"
                            title="Update Status"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Link href={`/vendors/${vendor.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(vendor.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Vendor Status</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {selectedVendor && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Vendor: <span className="font-semibold text-gray-900">{selectedVendor.name}</span></p>
                  <p className="text-sm text-gray-600">Current Status: <span className="font-semibold text-gray-900">{selectedVendor.status.toUpperCase()}</span></p>
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-700 font-medium">New Status</Label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {newStatus === 'approved' && (
                  <div>
                    <Label htmlFor="approved_by" className="text-gray-700 font-medium">Approved By</Label>
                    <Input
                      id="approved_by"
                      value={approvedBy}
                      onChange={(e) => setApprovedBy(e.target.value)}
                      placeholder="Enter approver name"
                      className="mt-1 border-gray-300 focus:border-purple-500"
                      required
                    />
                  </div>
                )}

                {newStatus === 'rejected' && (
                  <div>
                    <Label htmlFor="rejected_reason" className="text-gray-700 font-medium">Rejection Reason</Label>
                    <Input
                      id="rejected_reason"
                      value={rejectedReason}
                      onChange={(e) => setRejectedReason(e.target.value)}
                      placeholder="Enter rejection reason"
                      className="mt-1 border-gray-300 focus:border-purple-500"
                      required
                    />
                  </div>
                )}
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusModalOpen(false)}
              disabled={updatingStatus}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {updatingStatus ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
