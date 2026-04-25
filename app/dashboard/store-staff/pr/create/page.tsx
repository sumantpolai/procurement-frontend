'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreatePRForm from '@/components/pr/CreatePRForm';

export default function CreatePRPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Purchase Requisition
          </h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new PR</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PR Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePRForm redirectPath="/dashboard/store-staff/pr" />
        </CardContent>
      </Card>
    </div>
  );
}
