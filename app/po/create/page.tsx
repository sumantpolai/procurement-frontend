'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { POType, MatchingType, PR, Vendor } from '@/lib/types';

interface POItemForm {
  item_id: string;
  item_name: string;
  requested_qty: number;
  ordered_qty: number;
  unit_price: number;
  gst_percent: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  uom: string;
}

export default function CreatePOPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prIdParam = searchParams.get('pr_id');

  const [prSearchQuery, setPrSearchQuery] = useState('');
  const [prSearchResults, setPrSearchResults] = useState<PR[]>([]);
  const [searchingPR, setSearchingPR] = useState(false);
  const [prId, setPrId] = useState(prIdParam || '');
  const [prData, setPrData] = useState<PR | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorId, setVendorId] = useState('');
  const [poType, setPoType] = useState<POType>('STANDARD');
  const [matchingType, setMatchingType] = useState<MatchingType>('THREE_WAY');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<POItemForm[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingPR, setLoadingPR] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVendors();
    if (prIdParam) {
      loadPRData(prIdParam);
    }
  }, [prIdParam]);

  const loadVendors = async () => {
    try {
      const response = await api.vendors.getAll();
      setVendors(response);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleSearchPR = async (query: string) => {
    setPrSearchQuery(query);
    
    if (!query.trim()) {
      setPrSearchResults([]);
      return;
    }

    try {
      setSearchingPR(true);
      const response = await api.pr.search(query);
      
      if (response.data && Array.isArray(response.data)) {
        setPrSearchResults(response.data);
      } else {
        setPrSearchResults([response]);
      }
    } catch (error) {
      console.error('PR search failed:', error);
      setPrSearchResults([]);
    } finally {
      setSearchingPR(false);
    }
  };

  const selectPR = (pr: PR) => {
    setPrId(pr.id);
    setPrSearchQuery('');
    setPrSearchResults([]);
    loadPRData(pr.id);
  };

  const clearPR = () => {
    setPrId('');
    setPrData(null);
    setPrSearchQuery('');
    setItems([]);
  };

  const loadPRData = async (id: string) => {
    try {
      setLoadingPR(true);
      const pr = await api.pr.getById(id);
      setPrData(pr);
      
      console.log('PR Data:', pr);
      console.log('PR Items:', pr.items);
      
      const prItems = pr.items.map((prItem: any) => {
        console.log('Processing PR Item:', prItem);
        return {
          item_id: prItem.item_id,
          item_name: prItem.item_name || 'Unknown Item',
          requested_qty: Number(prItem.quantity) || 0,
          ordered_qty: Number(prItem.quantity) || 0,
          unit_price: 0,
          gst_percent: 0,
          cgst_percent: 0,
          sgst_percent: 0,
          igst_percent: 0,
          uom: prItem.uom || 'PCS',
        };
      });
      
      console.log('Processed Items:', prItems);
      
      if (prItems.length > 0) {
        setItems(prItems);
      }
    } catch (error) {
      console.error('Failed to load PR:', error);
      setError('Failed to load PR data');
    } finally {
      setLoadingPR(false);
    }
  };

  const updateItem = (index: number, field: keyof POItemForm, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const subtotal = Number(item.unit_price) * item.ordered_qty;
      const gstAmount = subtotal * (Number(item.gst_percent) / 100);
      return total + subtotal + gstAmount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount).replace('₹', '₹ ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!vendorId) {
      setError('Please select a vendor');
      return;
    }

    const validItems = items.filter(item => 
      item.item_id.trim() && 
      item.ordered_qty > 0 && 
      item.unit_price > 0
    );

    if (validItems.length === 0) {
      setError('Please complete all item details');
      return;
    }

    try {
      setLoading(true);
      await api.po.create({
        pr_id: prId || undefined,
        vendor_id: vendorId,
        store_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        location_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        created_by: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        po_type: poType,
        matching_type: matchingType,
        po_date: poDate,
        items: validItems,
      });
      router.push('/po');
    } catch (err) {
      setError('Failed to create purchase order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      <Card className="border-t-4 border-t-green-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-2xl text-gray-800">Create Purchase Order</CardTitle>
          {prData && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>Linked to PR: <span className="font-semibold">{prData.pr_number}</span></span>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {loadingPR && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
                <p className="text-sm">Loading PR data...</p>
              </div>
            )}

            {/* PR Search Section */}
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <Label className="text-gray-700 font-medium mb-2 block">Link to Purchase Request (Optional)</Label>
                {prData ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">{prData.pr_number}</p>
                      <p className="text-xs text-green-700">
                        Status: {prData.status.toUpperCase()} • Requested by: {prData.requested_by}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearPR}
                      className="text-red-600 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Input
                        value={prSearchQuery}
                        onChange={(e) => handleSearchPR(e.target.value)}
                        placeholder="Search PR by number (e.g., PR-001)"
                        className="pr-10 border-gray-300 focus:border-blue-500"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {prSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {prSearchResults.map((pr) => (
                          <button
                            key={pr.id}
                            type="button"
                            onClick={() => selectPR(pr)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <p className="font-medium text-gray-900">{pr.pr_number}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchingPR && (
                      <p className="text-xs text-gray-500 mt-1">Searching...</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vendor_id" className="text-gray-700 font-medium">Vendor</Label>
                <select
                  id="vendor_id"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="po_type" className="text-gray-700 font-medium">PO Type</Label>
                <select
                  id="po_type"
                  value={poType}
                  onChange={(e) => setPoType(e.target.value as POType)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="BLANKET">Blanket</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="PLANNED">Planned</option>
                </select>
              </div>

              <div>
                <Label htmlFor="matching_type" className="text-gray-700 font-medium">Matching Type</Label>
                <select
                  id="matching_type"
                  value={matchingType}
                  onChange={(e) => setMatchingType(e.target.value as MatchingType)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                >
                  <option value="TWO_WAY">Two Way</option>
                  <option value="THREE_WAY">Three Way</option>
                  <option value="FOUR_WAY">Four Way</option>
                </select>
              </div>

              <div>
                <Label htmlFor="po_date" className="text-gray-700 font-medium">PO Date</Label>
                <Input
                  id="po_date"
                  type="date"
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-green-500"
                  required
                />
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Items</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[200px]">Item Name</TableHead>
                        <TableHead className="w-[80px]">UOM</TableHead>
                        <TableHead className="w-[100px]">Requested Qty</TableHead>
                        <TableHead className="w-[100px]">Ordered Qty</TableHead>
                        <TableHead className="w-[120px]">Unit Price (₹)</TableHead>
                        <TableHead className="w-[80px]">GST %</TableHead>
                        <TableHead className="w-[80px]">CGST %</TableHead>
                        <TableHead className="w-[80px]">SGST %</TableHead>
                        <TableHead className="w-[80px]">IGST %</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => {
                        const subtotal = Number(item.unit_price) * item.ordered_qty;
                        const gstAmount = subtotal * (Number(item.gst_percent) / 100);
                        const total = subtotal + gstAmount;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.item_name}</TableCell>
                            <TableCell>{item.uom}</TableCell>
                            <TableCell>
                              <div className="px-3 py-2 bg-blue-50 text-blue-900 font-semibold rounded text-center">
                                {item.requested_qty}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.ordered_qty}
                                onChange={(e) => updateItem(index, 'ordered_qty', parseInt(e.target.value) || 1)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                className="w-28"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.gst_percent}
                                onChange={(e) => updateItem(index, 'gst_percent', parseFloat(e.target.value) || 0)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.cgst_percent}
                                onChange={(e) => updateItem(index, 'cgst_percent', parseFloat(e.target.value) || 0)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.sgst_percent}
                                onChange={(e) => updateItem(index, 'sgst_percent', parseFloat(e.target.value) || 0)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.igst_percent}
                                onChange={(e) => updateItem(index, 'igst_percent', parseFloat(e.target.value) || 0)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(total)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No items added. Please link a PR to add items.</p>
              </div>
            )}

            {items.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total PO Amount:</span>
                    <span className="text-3xl font-bold text-green-700">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading || items.length === 0} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                {loading ? 'Creating...' : 'Create Purchase Order'}
              </Button>
              <Link href="/po" className="flex-1">
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
