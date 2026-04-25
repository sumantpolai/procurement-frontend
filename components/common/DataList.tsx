'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Column<T = any> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  render?: (value: any, item: T) => ReactNode;
}

export interface DataListConfig<T = any> {
  title: string;
  description: string;
  addButtonText: string;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  loadingMessage: string;
  columns: Column<T>[];
  basePath: string;
  canCreate?: boolean;
  readOnly?: boolean;
}

interface DataListProps<T = any> {
  config: DataListConfig<T>;
  data: T[];
  loading: boolean;
  error?: string;
  onRefresh?: () => void;
  renderFilters?: () => ReactNode;
  renderPagination?: () => ReactNode;
  getItemId: (item: T) => string | number;
}

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
};

export function DataList<T = any>({
  config,
  data,
  loading,
  error,
  onRefresh,
  renderFilters,
  renderPagination,
  getItemId,
}: DataListProps<T>) {
  const router = useRouter();
  const EmptyIcon = config.emptyIcon;

  const getCellValue = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-gray-600 mt-1">
            {config.readOnly ? `${config.description} (Read Only)` : config.description}
          </p>
        </div>
        {config.canCreate && !config.readOnly && (
          <Button 
            onClick={() => router.push(`${config.basePath}/create`)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {config.addButtonText}
          </Button>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {renderFilters && (
        <Card>
          <CardContent className="pt-6">
            {renderFilters()}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{config.title} ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{config.loadingMessage}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <EmptyIcon className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">{config.emptyMessage}</p>
              {config.canCreate && !config.readOnly && (
                <Button 
                  onClick={() => router.push(`${config.basePath}/create`)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {config.addButtonText}
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {config.columns.map((column, index) => (
                        <TableHead key={index}>{column.header}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => {
                      const itemId = getItemId(item);
                      return (
                        <TableRow key={itemId}>
                          {config.columns.map((column, colIndex) => {
                            const value = getCellValue(item, column);
                            return (
                              <TableCell key={colIndex} className={column.className}>
                                {column.render ? column.render(value, item) : (value as ReactNode)}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`${config.basePath}/${itemId}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {renderPagination && (
                <div className="mt-4">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function renderBadge(status: string) {
  return (
    <Badge className={statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  );
}
