const fs = require('fs');
const path = 'src/app/(defaultLayout)/ai-design/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add imports
code = code.replace(
  'import { useGetProductByIdQuery } from "@/redux/api/productApi";',
  'import { useGetProductByIdQuery, useGetAllProductsQuery } from "@/redux/api/productApi";'
);

code = code.replace(
  'import { Loader2, Wand2, Download, ShoppingBag } from "lucide-react";',
  'import { Loader2, Wand2, Download, ShoppingBag } from "lucide-react";\nimport { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";'
);

// 2. Add state inside AiDesignPage
code = code.replace(
  'const [isUploading, setIsUploading] = useState(false);',
  'const [isUploading, setIsUploading] = useState(false);\n  const [showUpsell, setShowUpsell] = useState(false);\n  const [finalCartData, setFinalCartData] = useState<any>(null);\n  const { data: tshirtData } = useGetAllProductsQuery({ category: "t-shirt" });\n  const tshirtProduct = tshirtData?.data?.find((p: any) => p.category.toLowerCase() === "t-shirt") || tshirtData?.data?.[0];'
);

// 3. Modify "Add to Cart" button logic
const oldAddToCartLogic = `                        dispatch(addToCart({
                          id: \`\${productId}-\${selectedStyle}-\${Date.now()}\`,
                          productId: productId as string,
                          name: productData.data.name,
                          thumbnail: finalThumbnail, // The captured realistic mockup!
                          category: productData.data.category,
                          price: productData.data.discountPrice || productData.data.price,
                          quantity: 1,
                          aiDesignId: generatedDesignId,
                          aiDesign: {
                            generatedImage: generatedImageUrl
                          }
                        }));
                        toast.success("Personalized gift added to cart!", { id: toastId });
                        router.push("/cart");`;

const newAddToCartLogic = `                        const cartItem = {
                          id: \`\${productId}-\${selectedStyle}-\${Date.now()}\`,
                          productId: productId as string,
                          name: productData.data.name,
                          thumbnail: finalThumbnail,
                          category: productData.data.category,
                          price: productData.data.discountPrice || productData.data.price,
                          quantity: 1,
                          aiDesignId: generatedDesignId,
                          aiDesign: {
                            generatedImage: generatedImageUrl
                          }
                        };
                        setFinalCartData(cartItem);
                        toast.dismiss(toastId);
                        setShowUpsell(true);`;

code = code.replace(oldAddToCartLogic, newAddToCartLogic);

// 4. Add the Dialog before the final closing div
const dialogHtml = `
      <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-primary">Wait! Special Offer 🎁</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Want this amazing design on a premium T-Shirt too?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-40 h-40 relative rounded-2xl overflow-hidden bg-neutral-100 shadow-inner p-2 border-2 border-neutral-100">
              {tshirtProduct?.thumbnail ? (
                <div className="relative w-full h-full">
                  <Image src={tshirtProduct.thumbnail} alt="T-Shirt Mockup" fill className="object-cover opacity-90" />
                  <div className="absolute inset-0 p-8">
                     <Image src={generatedImageUrl} alt="Design" fill className="object-contain" />
                  </div>
                </div>
              ) : (
                <Image src={generatedImageUrl} alt="Design" fill className="object-cover rounded-xl" />
              )}
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-lg text-neutral-900">Premium Cotton T-Shirt</p>
              <p className="text-primary font-bold text-xl">Just ৳{tshirtProduct?.discountPrice || tshirtProduct?.price || 500}</p>
              <p className="text-sm text-neutral-500">Perfectly matches your new AI design.</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="w-full sm:w-1/2 h-12 rounded-xl"
              onClick={() => {
                dispatch(addToCart(finalCartData));
                toast.success("Item added to cart!");
                router.push("/cart");
              }}
            >
              No thanks
            </Button>
            <Button 
              className="w-full sm:w-1/2 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg"
              onClick={() => {
                dispatch(addToCart(finalCartData));
                if (tshirtProduct) {
                  dispatch(addToCart({
                    id: \`\${tshirtProduct.id}-\${selectedStyle}-upsell-\${Date.now()}\`,
                    productId: tshirtProduct.id,
                    name: \`\${tshirtProduct.name} (Custom AI)\`,
                    thumbnail: tshirtProduct.thumbnail || generatedImageUrl,
                    category: tshirtProduct.category,
                    price: tshirtProduct.discountPrice || tshirtProduct.price,
                    quantity: 1,
                    aiDesignId: generatedDesignId,
                    aiDesign: {
                      generatedImage: generatedImageUrl
                    }
                  }));
                }
                toast.success("Both items added to cart!");
                router.push("/cart");
              }}
            >
              Yes, Add Both!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n}\n$/, dialogHtml);

fs.writeFileSync(path, code);
