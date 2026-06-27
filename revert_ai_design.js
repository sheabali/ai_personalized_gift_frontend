const fs = require('fs');
const path = 'src/app/(defaultLayout)/ai-design/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove Dialog imports
code = code.replace(
  'import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";\n',
  ''
);
// or if it was on the same line
code = code.replace(
  'import { Loader2, Wand2, Download, ShoppingBag } from "lucide-react";\nimport { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";',
  'import { Loader2, Wand2, Download, ShoppingBag } from "lucide-react";'
);

// 2. Revert the "useGetAllProductsQuery" import
code = code.replace(
  'import { useGetProductByIdQuery, useGetAllProductsQuery } from "@/redux/api/productApi";',
  'import { useGetProductByIdQuery } from "@/redux/api/productApi";'
);

// 3. Remove state
const stateToRemove = `const [showUpsell, setShowUpsell] = useState(false);
  const [finalCartData, setFinalCartData] = useState<any>(null);
  const { data: tshirtData } = useGetAllProductsQuery({ category: "t-shirt" });
  const tshirtProduct = tshirtData?.data?.find((p: any) => p.category.toLowerCase() === "t-shirt") || tshirtData?.data?.[0];`;

code = code.replace(stateToRemove, '');

// 4. Revert "Add to Cart" button logic
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

code = code.replace(newAddToCartLogic, oldAddToCartLogic);

// 5. Remove the Dialog
const dialogRegex = /<Dialog open=\{showUpsell\}[\s\S]*?<\/Dialog>/;
code = code.replace(dialogRegex, '');

fs.writeFileSync(path, code);
