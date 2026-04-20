'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Item } from '@/lib/types';

interface PRItemForm {
  item_id: string;
  item_name: string;
  item_code: string;
  item_category: string;
  item_uom: string;
  quantity: number;
}

export default function CreatePRPage() {
  const router = useRouter();
  const [requestedBy, setRequestedBy] = useState('');
  const [items, setItems] = useState<PRItemForm[]>([{ 
    item_id: '', 
    item_name: '', 
    item_code: '',
    item_category: '',
    item_uom: '',
    quantity: 1 
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});
  const [searchResults, setSearchResults] = useState<{ [key: number]: Item[] }>({});
  const [searching, setSearching] = useState<{ [key: number]: boolean }>({});

  const addItem = () => {
    setItems([...items, { 
      item_id: '', 
      item_name: '', 
      item_code: '',
      item_category: '',
      item_uom: '',
      quantity: 1 
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      const newSearchQuery = { ...searchQuery };
      const newSearchResults = { ...searchResults };
      delete newSearchQuery[index];
      delete newSearchResults[index];
      setSearchQuery(newSearchQuery);
      setSearchResults(newSearchResults);
    }
  };

  const updateItem = (index: number, field: keyof PRItemForm, value: string | number) => {
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
      const results = await api.items.search(query);
      setSearchResults({ ...searchResults, [index]: results });
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({ ...searchResults, [index]: [] });
    } finally {
      setSearching({ ...searching, [index]: false });
    }
  };

  const selectItem = (index: number, item: Item) => {
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
    updateItem(index, 'item_code', '');
    updateItem(index, 'item_category', '');
    updateItem(index, 'item_uom', '');
    setSearchQuery({ ...searchQuery, [index]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!requestedBy.trim()) {
      setError('Please enter requester name');
      return;
    }

    const validItems = items.filter(item => item.item_id.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid item');
      return;
    }

    try {
      setLoading(true);
      await api.pr.create({
        requested_by: requestedBy,
        items: validItems.map(item => ({ item_id: item.item_id, quantity: item.quantity })),
      });
      router.push('/pr');
    } catch (err) {
      setError('Failed to create purchase request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/pr">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to PRs
          </Button>
        </Link>
      </div>

      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl text-gray-800">Create Purchase Request</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Fill in the details to create a new PR</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="requested_by" className="text-gray-700 font-medium">Requested By</Label>
              <Input
                id="requested_by"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-gray-700 font-medium">Items</Label>
                <Button type="button" onClick={addItem} variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-10">
                          <Label htmlFor={`item_search_${index}`} className="text-gray-700">Search Item</Label>
                          {item.item_id ? (
                            <div className="mt-1 flex items-center gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                              <div className="flex-1">
                                <p className="font-semibold text-green-900">{item.item_name}</p>
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
                                  className="pr-10 border-gray-300 focus:border-blue-500"
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
                                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
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
                            <Label htmlFor={`quantity_${index}`} className="text-gray-700">Quantity</Label>
                            <Input
                              id={`quantity_${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="mt-1 border-gray-300 focus:border-blue-500"
                              required
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="w-full bg-red-500 hover:bg-red-600"
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Creating...' : 'Create Purchase Request'}
              </Button>
              <Link href="/pr" className="flex-1">
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
