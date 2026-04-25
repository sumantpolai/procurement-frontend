'use client';

import { useParams } from 'next/navigation';
import ItemDetails from '@/components/item/ItemDetails';

export default function ItemDetailsPage() {
  const params = useParams();

  return (
    <ItemDetails
      itemId={params.id as string}
      backPath="/dashboard/purchase-staff/item-masters"
    />
  );
}
