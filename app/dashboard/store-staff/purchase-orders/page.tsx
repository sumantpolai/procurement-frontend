'use client';

import POList from '@/components/po/POList';

export default function PurchaseOrdersPage() {
  return <POList basePath="/dashboard/store-staff/purchase-orders" canCreate={false} readOnly={true} />;
}
