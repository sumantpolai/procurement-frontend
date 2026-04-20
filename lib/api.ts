const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Item endpoints
  items: {
    getAll: async (page = 1, limit = 10) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const res = await fetch(`${API_BASE_URL}/items?${params}`);
      if (!res.ok) throw new Error('Failed to fetch items');
      return res.json();
    },
    search: async (name: string) => {
      const res = await fetch(`${API_BASE_URL}/items/search/?name=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error('Failed to search items');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/items/${id}`);
      if (!res.ok) throw new Error('Failed to fetch item');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update item status');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return res.json();
    },
  },
  // Vendor endpoints
  vendors: {
    getAll: async (page = 1, limit = 100) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const res = await fetch(`${API_BASE_URL}/vendors?${params}`);
      if (!res.ok) throw new Error('Failed to fetch vendors');
      return res.json();
    },
    search: async (query: string) => {
      const params = new URLSearchParams({ search: query });
      const res = await fetch(`${API_BASE_URL}/vendors/search?${params}`);
      if (!res.ok) throw new Error('Failed to search vendors');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/vendors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch vendor');
      return res.json();
    },
    create: async (data: any) => {
      console.log('Creating vendor with data:', data);
      const res = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Vendor create error:', errorData);
        throw new Error(JSON.stringify(errorData.detail || errorData));
      }
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update vendor');
      return res.json();
    },
    updateStatus: async (id: string, status: string, approved_by?: string, rejected_reason?: string) => {
      const res = await fetch(`${API_BASE_URL}/vendors/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approved_by, rejected_reason }),
      });
      if (!res.ok) throw new Error('Failed to update vendor status');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete vendor');
      return res.json();
    },
  },
  // PR endpoints
  pr: {
    getAll: async (page = 1, limit = 10, status?: string) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status_filter', status);
      const res = await fetch(`${API_BASE_URL}/pr?${params}`);
      if (!res.ok) throw new Error('Failed to fetch PRs');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/pr/${id}`);
      if (!res.ok) throw new Error('Failed to fetch PR');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create PR');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE_URL}/pr/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update PR status');
      return res.json();
    },
    search: async (prNumber: string) => {
      const res = await fetch(`${API_BASE_URL}/pr/search/${prNumber}`);
      if (!res.ok) throw new Error('Failed to search PR');
      return res.json();
    },
  },
  // PO endpoints
  po: {
    getAll: async (page = 1, limit = 10, status?: string) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status_filter', status);
      const res = await fetch(`${API_BASE_URL}/po?${params}`);
      if (!res.ok) throw new Error('Failed to fetch POs');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/po/${id}`);
      if (!res.ok) throw new Error('Failed to fetch PO');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/po`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create PO');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE_URL}/po/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update PO status');
      return res.json();
    },
    search: async (poNumber: string) => {
      const res = await fetch(`${API_BASE_URL}/po/search/${poNumber}`);
      if (!res.ok) throw new Error('Failed to search PO');
      return res.json();
    },
  },
};
