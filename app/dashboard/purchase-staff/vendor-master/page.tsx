import VendorList from '@/components/vendor/VendorList';

export default function VendorMasterPage() {
  return <VendorList basePath="/dashboard/purchase-staff/vendor-master" canCreate={true} />;
}
