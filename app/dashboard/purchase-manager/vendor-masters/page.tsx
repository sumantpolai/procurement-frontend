import VendorList from '@/components/vendor/VendorList';

export default function VendorMastersPage() {
  return <VendorList basePath="/dashboard/purchase-manager/vendor-masters" canCreate={true} />;
}
