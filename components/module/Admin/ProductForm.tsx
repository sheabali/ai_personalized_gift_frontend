"use client";

import { useCreateProductMutation, useUpdateProductMutation } from "@/redux/api/productApi";
import { useUploadImageMutation } from "@/redux/api/uploadApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import NRInput from "@/components/form/NRInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  X, 
  Sparkles, 
  Package, 
  Tag, 
  DollarSign,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  discountPrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  isAiEnabled: z.boolean().default(false),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  images: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || "");
  const [isUploading, setIsUploading] = useState(false);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();

  const methods = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      stock: 0,
      isActive: true,
      isAiEnabled: false,
      thumbnail: "",
      images: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      if (res.success) {
        methods.setValue("thumbnail", res.data.url);
        setThumbnailPreview(res.data.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await updateProduct({ id: initialData.id, ...data }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product created successfully");
      }
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 mb-4">
                <FileText className="w-5 h-5" />
                <h3 className="text-xl font-bold">General Information</h3>
              </div>
              
              <NRInput
                name="name"
                label="Product Name"
                placeholder="e.g. Personalized Anime Portrait"
                control={methods.control as any}
              />
              
              <div className="space-y-2">
                <Label className="text-neutral-900 font-bold">Description</Label>
                <textarea
                  {...methods.register("description")}
                  className="w-full min-h-[150px] p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your product..."
                />
                {methods.formState.errors.description && (
                  <p className="text-xs text-red-500">{methods.formState.errors.description.message as string}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NRInput
                  name="category"
                  label="Category"
                  placeholder="e.g. Art Prints"
                  control={methods.control as any}
                />
                <NRInput
                  name="stock"
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  control={methods.control as any}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 mb-4">
                <DollarSign className="w-5 h-5" />
                <h3 className="text-xl font-bold">Pricing</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NRInput
                  name="price"
                  label="Regular Price ($)"
                  type="number"
                  placeholder="0.00"
                  control={methods.control as any}
                />
                <NRInput
                  name="discountPrice"
                  label="Discount Price ($)"
                  type="number"
                  placeholder="0.00"
                  control={methods.control as any}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 mb-4">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-xl font-bold">Media</h3>
              </div>
              
              <div className="space-y-4">
                <Label className="text-neutral-900 font-bold">Thumbnail Image</Label>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border-2 border-dashed border-neutral-200 group transition-all hover:border-primary">
                  {thumbnailPreview ? (
                    <>
                      <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                      <button 
                        onClick={() => { setThumbnailPreview(""); methods.setValue("thumbnail", ""); }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <Upload className="w-8 h-8 text-neutral-400 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-neutral-500 font-medium group-hover:text-primary transition-colors">
                        {isUploading ? "Uploading..." : "Upload Thumbnail"}
                      </span>
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  )}
                </div>
                {methods.formState.errors.thumbnail && (
                  <p className="text-xs text-red-500">{methods.formState.errors.thumbnail.message as string}</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xl font-bold">Status & Features</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-neutral-900 font-bold">Active Status</Label>
                    <p className="text-xs text-neutral-500">Visible in store</p>
                  </div>
                  <Switch 
                    checked={methods.watch("isActive")} 
                    onCheckedChange={(val) => methods.setValue("isActive", val)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-neutral-900 font-bold">AI Enabled</Label>
                    <p className="text-xs text-neutral-500">Allow personalization</p>
                  </div>
                  <Switch 
                    checked={methods.watch("isAiEnabled")} 
                    onCheckedChange={(val) => methods.setValue("isAiEnabled", val)} 
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isCreating || isUpdating || isUploading}
              className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 transition-all"
            >
              {isEdit ? (isUpdating ? "Updating..." : "Update Product") : (isCreating ? "Creating..." : "Create Product")}
            </Button>
          </div>

        </div>
      </form>
    </FormProvider>
  );
}
