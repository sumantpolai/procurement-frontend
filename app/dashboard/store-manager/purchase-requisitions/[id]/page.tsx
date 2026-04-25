'use client';

import { useParams } from 'next/navigation';
import PRDetails from '@/components/pr/PRDetails';

export default function PRDetailPage() {
  const params = useParams();

  return (
    <PRDetails
      prId={params.id as string}
      backPath="/dashboard/store-manager/purchase-requisitions"
      canUpdateStatus={true}
      canCreatePO={true}
    />
  );
}