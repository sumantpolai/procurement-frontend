import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreatePOForm from '@/components/po/CreatePOForm';

export default function CreatePOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Purchase Order
        </h1>
        <p className="text-gray-600 mt-1">Create a new purchase order</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PO Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePOForm redirectPath="/dashboard/purchase-manager/purchase-orders" />
        </CardContent>
      </Card>
    </div>
  );
}
