import ItemList from '@/components/item/ItemList';

export default function ItemMastersPage() {
  return <ItemList basePath="/dashboard/store-staff/item-masters" canCreate={true} />;
}
