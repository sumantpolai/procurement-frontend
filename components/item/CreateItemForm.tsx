'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/services/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface CreateItemFormProps {
  redirectPath: string;
}

export default function CreateItemForm({ redirectPath }: CreateItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    item_type: 'raw_material',
    item_category: '',
    uom: '',
    status: 'draft',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.item_category.trim() || !formData.uom.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create item');
      }

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
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
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <Label htmlFor="item_type">Item Type *</Label>
          <select
            id="item_type"
            value={formData.item_type}
            onChange={(e) => handleChange('item_type', e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="raw_material">Raw Material</option>
            <option value="finished_goods">Finished Goods</option>
            <option value="consumables">Consumables</option>
            <option value="spare_parts">Spare Parts</option>
          </select>
        </div>

        <div>
          <Label htmlFor="item_category">Item Category *</Label>
          <Input
            id="item_category"
            value={formData.item_category}
            onChange={(e) => handleChange('item_category', e.target.value)}
            placeholder="e.g., Electronics, Hardware"
            required
          />
        </div>

        <div>
          <Label htmlFor="uom">Unit of Measurement (UOM) *</Label>
          <Input
            id="uom"
            value={formData.uom}
            onChange={(e) => handleChange('uom', e.target.value)}
            placeholder="e.g., PCS, KG, LTR"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {loading ? 'Creating...' : 'Create Item'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
