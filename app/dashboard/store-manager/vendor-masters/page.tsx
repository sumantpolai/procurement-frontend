import VendorList from '@/components/vendor/VendorList';

export default function VendorMastersPage() {
  return <VendorList basePath="/dashboard/store-manager/vendor-masters" readOnly={true} />;
}
