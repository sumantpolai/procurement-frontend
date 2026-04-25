import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateItemForm from '@/components/item/CreateItemForm';

export default function CreateItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create New Item
        </h1>
        <p className="text-gray-600 mt-1">Add a new item to the inventory</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateItemForm redirectPath="/dashboard/store-staff/item-masters" />
        </CardContent>
      </Card>
    </div>
  );
}
