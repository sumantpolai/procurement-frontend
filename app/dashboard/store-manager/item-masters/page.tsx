import ItemList from '@/components/item/ItemList';

export default function ItemMastersPage() {
  return <ItemList basePath="/dashboard/store-manager/item-masters" canCreate={true} />;
}
