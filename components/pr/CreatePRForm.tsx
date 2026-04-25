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

interface PRItem {
  item_id: string;
  quantity: number;
  item_name?: string;
  item_code?: string;
  item_category?: string;
  item_uom?: string;
}

interface CreatePRFormProps {
  redirectPath: string;
}

export default function CreatePRForm({ redirectPath }: CreatePRFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [items, setItems] = useState<PRItem[]>([{ item_id: '', quantity: 1 }]);
  const [searchQuery, setSearchQuery] = useState<Record<number, string>>({});
  const [searchResults, setSearchResults] = useState<Record<number, any[]>>({});
  const [searching, setSearching] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const user = tokenManager.getUser();
    if (user) {
      setRequestedBy(user.full_name || user.username || user.email);
    }
  }, []);

  const addItem = () => {
    setItems([...items, { item_id: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof PRItem, value: any) => {
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
      item_category: item.item_category,
      item_uom: item.uom,
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



    const validItems = items.filter(item => item.item_id.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid item');
      return;
    }

    try {
      setLoading(true);
      const token = tokenManager.getToken();
      const response = await fetch(`${API_BASE_URL}/pr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          requested_by: requestedBy,
          items: validItems.map(item => ({ 
            item_id: item.item_id, 
            quantity: item.quantity 
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create PR');
      }

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to create purchase requisition');
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-10">
                    <Label htmlFor={`item_search_${index}`}>Search Item</Label>
                    {item.item_id ? (
                      <div className="mt-1 flex items-center gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{item.item_name}</p>
                          <p className="text-xs text-green-700">
                            {item.item_code} • {item.item_category} • {item.item_uom}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => clearItem(index)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative mt-1">
                        <div className="relative">
                          <Input
                            id={`item_search_${index}`}
                            value={searchQuery[index] || ''}
                            onChange={(e) => handleSearchItem(index, e.target.value)}
                            placeholder="Type to search items..."
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        {searchResults[index] && searchResults[index].length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {searchResults[index].map((searchItem) => (
                              <button
                                key={searchItem.id}
                                type="button"
                                onClick={() => selectItem(index, searchItem)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                              >
                                <p className="font-medium text-gray-900">{searchItem.name}</p>
                                <p className="text-xs text-gray-500">
                                  {searchItem.code} • {searchItem.item_category} • {searchItem.uom}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                        {searching[index] && (
                          <p className="text-xs text-gray-500 mt-1">Searching...</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                      <Input
                        id={`quantity_${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
          {loading ? 'Creating...' : 'Create Purchase Requisition'}
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
