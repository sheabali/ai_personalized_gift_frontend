import ProductTable from "@/components/module/Admin/ProductTable";

export const metadata = {
  title: "Manage Products | GiftAI Admin",
  description: "View and manage your gift collections",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Products</h1>
        <p className="text-neutral-500">Manage your product catalog, prices, and stock levels.</p>
      </div>
      
      <ProductTable />
    </div>
  );
}
