import { useMemo, useState } from "react";
import { useGetAllProductsQuery, useDeleteProductMutation } from "@/redux/api/productApi";
import { getProductColumns } from "@/components/module/Admin/Products/ProductColumns";
import { toast } from "sonner";

/**
 * Custom hook encapsulating all data-fetching and action logic for the Admin Product Table.
 * Keeps the ProductTable component as a pure-UI renderer.
 */
export function useProductTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products — re-fetches automatically when searchTerm changes
  const { data, isLoading } = useGetAllProductsQuery({ search: searchTerm });
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];

  /**
   * Prompts user for confirmation, then deletes the product via the API.
   * Shows a success or error toast based on the result.
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  // Memoize columns so they're only recomputed when handleDelete reference changes
  const columns = useMemo(() => getProductColumns(handleDelete), [handleDelete]);

  return {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    columns,
  };
}
