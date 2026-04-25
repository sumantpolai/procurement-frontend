'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/services/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Search, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface POItem {
  item_id: string;
  ordered_qty: number;
  unit_price: number;
  gst_percent: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  uom: string;
  hsn_code?: string;
  item_name?: string;
  item_code?: string;
}

interface CreatePOFormProps {
  redirectPath: string;
}

export default function CreatePOForm({ redirectPath }: CreatePOFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<POItem[]>([{
    item_id: '',
    ordered_qty: 1,
    unit_price: 0,
    gst_percent: 0,
    cgst_percent: 0,
    sgst_percent: 0,
    igst_percent: 0,
    uom: '',
  }]);
  const [searchQuery, setSearchQuery] = useState<Record<number, string>>({});
  const [searchResults, setSearchResults] = useState<Record<number, any[]>>({});
  const [searching, setSearching] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  const addItem = () => {
    setItems([...items, {
      item_id: '',
      ordered_qty: 1,
      unit_price: 0,
      gst_percent: 0,
      cgst_percent: 0,
      sgst_percent: 0,
      igst_percent: 0,
      uom: '',
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSearchItem = async (index: number, query: string) => {
    setSearchQuery({ ...searchQuery, [index]: query });
    
    if (!query.trim()) {
      setSearchResults({ ...searchResults, [index]: [] });
      return;
    }

    try {
      setSearching({ ...searching, [index]: true });
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/items/search/?name=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Search failed');
      const results = await response.json();
      setSearchResults({ ...searchResults, [index]: results });
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({ ...searchResults, [index]: [] });
    } finally {
      setSearching({ ...searching, [index]: false });
    }
  };

  const selectItem = (index: number, item: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      item_id: item.id,
      item_name: item.name,
      item_code: item.code,
      uom: item.uom || '',
    };
    setItems(newItems);
    setSearchQuery({ ...searchQuery, [index]: '' });
    setSearchResults({ ...searchResults, [index]: [] });
  };

  const clearItem = (index: number) => {
    updateItem(index, 'item_id', '');
    updateItem(index, 'item_name', '');
    setSearchQuery({ ...searchQuery, [index]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedVendor) {
      setError('Please select a vendor');
      return;
    }

    const validItems = items.filter(item => item.item_id.trim() && item.ordered_qty > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid item');
      return;
    }

    try {
      setLoading(true);
      const token = tokenManager.getToken();
      const user = tokenManager.getUser();
      
      const response = await fetch(`${API_BASE_URL}/po`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendor_id: selectedVendor,
          store_id: '00000000-0000-0000-0000-000000000000',
          location_id: '00000000-0000-0000-0000-000000000000',
          created_by: user?.id || '00000000-0000-0000-0000-000000000000',
          po_type: 'standard',
          matching_type: 'two_way',
          po_date: poDate,
          items: validItems.map(item => ({
            item_id: item.item_id,
            ordered_qty: item.ordered_qty,
            unit_price: item.unit_price,
            gst_percent: item.gst_percent,
            cgst_percent: item.cgst_percent,
            sgst_percent: item.sgst_percent,
            igst_percent: item.igst_percent,
            uom: item.uom,
            hsn_code: item.hsn_code || null,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create PO');
      }

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="vendor">Vendor *</Label>
          <select
            id="vendor"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="w-full p-2 border rounded-md"
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
          <Label htmlFor="po_date">PO Date *</Label>
          <Input
            id="po_date"
            type="date"
            value={poDate}
            onChange={(e) => setPoDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Items</Label>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-blue-400">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label>Search Item</Label>
                    {item.item_id ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{item.item_name}</p>
                          <p className="text-xs text-green-700">{item.item_code}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => clearItem(index)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          value={searchQuery[index] || ''}
                          onChange={(e) => handleSearchItem(index, e.target.value)}
                          placeholder="Type to search items..."
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {searchResults[index] && searchResults[index].length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {searchResults[index].map((searchItem) => (
                              <button
                                key={searchItem.id}
                                type="button"
                                onClick={() => selectItem(index, searchItem)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                              >
                                <p className="font-medium">{searchItem.name}</p>
                                <p className="text-xs text-gray-500">{searchItem.code}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.ordered_qty}
                        onChange={(e) => updateItem(index, 'ordered_qty', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label>GST %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.gst_percent}
                        onChange={(e) => updateItem(index, 'gst_percent', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>UOM *</Label>
                      <Input
                        value={item.uom}
                        onChange={(e) => updateItem(index, 'uom', e.target.value)}
                        placeholder="e.g., PCS"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
