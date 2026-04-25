import ItemList from '@/components/item/ItemList';

export default function ItemMastersPage() {
  return <ItemList basePath="/dashboard/purchase-manager/item-masters" readOnly={true} />;
}
