import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateVendorForm from '@/components/vendor/CreateVendorForm';

export default function CreateVendorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create New Vendor
        </h1>
        <p className="text-gray-600 mt-1">Add a new vendor to the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateVendorForm redirectPath="/dashboard/purchase-manager/vendor-masters" />
        </CardContent>
      </Card>
    </div>
  );
}
