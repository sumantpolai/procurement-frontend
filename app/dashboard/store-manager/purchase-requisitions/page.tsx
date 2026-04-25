import PRList from '@/components/pr/PRList';

export default function PurchaseRequisitionsPage() {
  return <PRList basePath="/dashboard/store-manager/purchase-requisitions" canCreate={true} />;
}
