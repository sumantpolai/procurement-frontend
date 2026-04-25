import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreatePRForm from '@/components/pr/CreatePRForm';

export default function CreatePRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Purchase Requisition
        </h1>
        <p className="text-gray-600 mt-1">Request items for procurement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PR Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePRForm redirectPath="/dashboard/store-manager/purchase-requisitions" />
        </CardContent>
      </Card>
    </div>
  );
}
