'use client';

import PRList from '@/components/pr/PRList';

export default function PRListPage() {
  return <PRList basePath="/dashboard/store-staff/pr" canCreate={true} />;
}
