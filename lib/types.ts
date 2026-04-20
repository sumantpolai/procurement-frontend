export type PRStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type POStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'partially_received' | 'received' | 'closed';
export type POType = 'STANDARD' | 'BLANKET' | 'CONTRACT' | 'PLANNED';
export type MatchingType = 'TWO_WAY' | 'THREE_WAY' | 'FOUR_WAY';
export type ItemType = 'text' | 'service' | 'inventory_item';
export type ItemCategory = 'consumable' | 'Pharmaceuticals' | 'equipment' | 'other';
export type ItemStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export type VendorStatus = 'pending' | 'approved' | 'rejected';

export interface Item {
  id: string;
  code: string;
  name: string;
  item_type: ItemType;
  item_category: ItemCategory;
  uom: string;
  status: ItemStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: VendorStatus;
  pan_no: string;
  gst_no: string | null;
  bank_details: {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch: string;
    address: string;
  };
  created_at: string;
}

export interface PRItem {
  item_id: string;
  quantity: number;
}

export interface PR {
  id: string;
  pr_number: string;
  requested_by: string;
  status: PRStatus;
  items: PRItem[];
  created_at: string;
  updated_at?: string;
}

export interface POItem {
  item_id: string;
  ordered_qty: number;
  unit_price: number;
  gst_percent: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  uom: string;
  hsn_code: string;
}

export interface PO {
  id: string;
  po_number: string;
  pr_id?: string;
  vendor_id: string;
  store_id: string;
  location_id: string;
  created_by: string;
  po_type: POType;
  matching_type: MatchingType;
  po_date: string;
  status: POStatus;
  items: POItem[];
  total_amount?: number;
  created_at: string;
  updated_at?: string;
}
