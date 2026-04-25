import POList from '@/components/po/POList';

export default function PurchaseOrdersPage() {
  return <POList basePath="/dashboard/store-manager/purchase-orders" readOnly={true} />;
}
