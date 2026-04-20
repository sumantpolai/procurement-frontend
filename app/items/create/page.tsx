'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { ItemType, ItemCategory, ItemStatus } from '@/lib/types';

export default function CreateItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    item_type: 'inventory_item' as ItemType,
    item_category: 'consumable' as ItemCategory,
    uom: '',
    status: 'Draft' as ItemStatus,
    created_by: '00000000-0000-0000-0000-000000000000',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await api.items.create(formData);
      router.push('/items');
    } catch (err) {
      setError('Failed to create item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/items">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Items
          </Button>
        </Link>
      </div>

      <Card className="border-t-4 border-t-orange-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardTitle className="text-2xl text-gray-800">Create Item</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Add a new item to inventory</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code" className="text-gray-700 font-medium">Item Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="e.g., ITM-001"
                  className="mt-1 border-gray-300 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter item name"
                  className="mt-1 border-gray-300 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="item_type" className="text-gray-700 font-medium">Item Type</Label>
                <select
                  id="item_type"
                  value={formData.item_type}
                  onChange={(e) => handleChange('item_type', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="inventory_item">Inventory Item</option>
                  <option value="service">Service</option>
                  <option value="text">Text</option>
                </select>
              </div>

              <div>
                <Label htmlFor="item_category" className="text-gray-700 font-medium">Category</Label>
                <select
                  id="item_category"
                  value={formData.item_category}
                  onChange={(e) => handleChange('item_category', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="consumable">Consumable</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="uom" className="text-gray-700 font-medium">Unit of Measure (UOM)</Label>
                <Input
                  id="uom"
                  value={formData.uom}
                  onChange={(e) => handleChange('uom', e.target.value)}
                  placeholder="e.g., PCS, KG, LTR"
                  className="mt-1 border-gray-300 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                {loading ? 'Creating...' : 'Create Item'}
              </Button>
              <Link href="/items" className="flex-1">
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
