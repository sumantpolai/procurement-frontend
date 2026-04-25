import ItemList from '@/components/item/ItemList';

export default function ItemMasterPage() {
  return <ItemList basePath="/dashboard/purchase-staff/item-master" readOnly={true} />;
}
