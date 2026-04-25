'use client';

import { useParams } from 'next/navigation';
import PRDetails from '@/components/pr/PRDetails';

export default function PRDetailPage() {
  const params = useParams();

  return (
    <PRDetails
      prId={params.id as string}
      backPath="/dashboard/purchase-staff/purchase-requisitions"
      readOnly={true}
    />
  );
}
