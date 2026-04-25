import POList from '@/components/po/POList';

export default function PurchaseOrdersPage() {
  return <POList basePath="/dashboard/purchase-manager/purchase-orders" canCreate={true} />;
}
