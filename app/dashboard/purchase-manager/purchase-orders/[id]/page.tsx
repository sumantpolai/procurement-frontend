'use client';

import { useParams } from 'next/navigation';
import PODetails from '@/components/po/PODetails';

export default function PODetailsPage() {
  const params = useParams();

  return (
    <PODetails
      poId={params.id as string}
      backPath="/dashboard/purchase-manager/purchase-orders"
      canUpdateStatus={true}
    />
  );
}