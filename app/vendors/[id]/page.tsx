'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan_no: '',
    gst_no: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch: '',
    address: '',
  });

  useEffect(() => {
    loadVendor();
  }, [vendorId]);

  const loadVendor = async () => {
    try {
      setLoadingData(true);
      const vendor = await api.vendors.getById(vendorId);
      setFormData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        pan_no: vendor.pan_no || '',
        gst_no: vendor.gst_no || '',
        bank_name: vendor.bank_details.bank_name,
        account_number: vendor.bank_details.account_number,
        ifsc_code: vendor.bank_details.ifsc_code,
        branch: vendor.bank_details.branch,
        address: vendor.bank_details.address,
      });
    } catch (error) {
      console.error('Failed to load vendor:', error);
      setError('Failed to load vendor data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await api.vendors.update(vendorId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pan_no: formData.pan_no,
        gst_no: formData.gst_no,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        branch: formData.branch,
        address: formData.address,
      });
      router.push('/vendors');
    } catch (err) {
      setError('Failed to update vendor. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/vendors">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </Link>
      </div>

      <Card className="border-t-4 border-t-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-2xl text-gray-800">Edit Vendor</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Update vendor information</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">Vendor Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter vendor name"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="vendor@example.com"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 1234567890"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pan_no" className="text-gray-700 font-medium">PAN Number</Label>
                  <Input
                    id="pan_no"
                    value={formData.pan_no}
                    onChange={(e) => handleChange('pan_no', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gst_no" className="text-gray-700 font-medium">GST Number (Optional)</Label>
                  <Input
                    id="gst_no"
                    value={formData.gst_no}
                    onChange={(e) => handleChange('gst_no', e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Bank Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name" className="text-gray-700 font-medium">Bank Name</Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                    placeholder="Enter bank name"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="account_number" className="text-gray-700 font-medium">Account Number</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) => handleChange('account_number', e.target.value)}
                    placeholder="Enter account number"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ifsc_code" className="text-gray-700 font-medium">IFSC Code</Label>
                  <Input
                    id="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={(e) => handleChange('ifsc_code', e.target.value)}
                    placeholder="Enter IFSC code"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="branch" className="text-gray-700 font-medium">Branch</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    placeholder="Enter branch name"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter bank address"
                    className="mt-1 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                {loading ? 'Updating...' : 'Update Vendor'}
              </Button>
              <Link href="/vendors" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
