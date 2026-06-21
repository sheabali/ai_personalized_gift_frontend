"use client";

import { useUploadImageMutation } from "@/redux/api/uploadApi";
import { useGenerateDesignMutation } from "@/redux/api/aiDesignApi";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Image as ImageIcon,
  Zap,
  ArrowRight,
  Gift
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Wand2, Download, ShoppingBag } from "lucide-react";
import DynamicMockupCanvas from "../../../components/module/AiDesign/DynamicMockupCanvas";
import { toPng } from "html-to-image";

const STYLES = [
  { id: "anime", name: "Anime Style", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=500&auto=format&fit=crop", description: "Vibrant colors and expressive features" },
  { id: "cartoon", name: "3D Cartoon", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop", description: "Playful Pixar-style 3D aesthetics" },
  { id: "sketch", name: "Pencil Sketch", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=crop", description: "Hand-drawn artistic pencil details" },
  { id: "cyberpunk", name: "Cyberpunk", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=500&auto=format&fit=crop", description: "Neon lights and futuristic vibes" },
];

export default function AiDesignPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productId) {
      toast.error("Please select a product first");
      router.push("/products");
    }
  }, [productId, router]);

  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generatedDesignId, setGeneratedDesignId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: productData } = useGetProductByIdQuery(productId as string, { skip: !productId });
  const [uploadImage] = useUploadImageMutation();
  const [generateDesign, { isLoading: isGenerating }] = useGenerateDesignMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      if (res.success) {
        setOriginalImageUrl(res.data.url);
        toast.success("Photo uploaded successfully!");
        setStep(2);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!productId) {
      toast.error("No product selected. Please go back to the product page.");
      return;
    }
    if (!originalImageUrl) {
      toast.error("Please upload a photo first.");
      setStep(1);
      return;
    }
    if (!selectedStyle) {
      toast.error("Please select an art style.");
      setStep(2);
      return;
    }

    try {
      const res = await generateDesign({
        productId: productId as string,
        originalImage: originalImageUrl,
        style: selectedStyle,
        prompt: subjectDescription.trim() ? subjectDescription : `A beautiful portrait of the subject`
      }).unwrap();

      if (res.success) {
        setGeneratedImageUrl(res.data.generatedImage);
        setGeneratedDesignId(res.data.id);
        toast.success("Magic complete!");
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "AI generation failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-neutral-300 border border-neutral-200"
                  }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${step > s ? "bg-primary" : "bg-neutral-200"
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload Photo */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-neutral-100 text-center space-y-8"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">Upload your photo</h2>
                <p className="text-neutral-500">
                  Choose a clear photo of your face. Our AI works best with good lighting and simple backgrounds.
                </p>
              </div>

              <div className="max-w-lg mx-auto">
                <label className="group relative block aspect-video rounded-[2rem] border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-primary transition-all cursor-pointer overflow-hidden">
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    {isUploading ? (
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-neutral-900">Click to upload</p>
                          <p className="text-sm text-neutral-400 font-medium">JPG, PNG or WEBP (Max 5MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Style */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-neutral-900">Choose your AI style</h2>
                <p className="text-neutral-500">Select the artistic direction for your personalized gift.</p>
              </div>

              <div className="max-w-xl mx-auto mb-10 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                <label className="block text-sm font-bold text-neutral-900 mb-2">What is in the photo? (Optional but recommended)</label>
                <input
                  type="text"
                  placeholder="e.g. A cute orange cat, A young man with glasses, A golden retriever"
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-neutral-100 focus:border-primary outline-none transition-colors"
                />
                <p className="text-xs text-neutral-400 mt-2">This helps the AI generate exactly what you want.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative p-2 rounded-[2rem] bg-white border-2 transition-all text-left group ${selectedStyle === style.id ? "border-primary shadow-xl shadow-primary/10" : "border-neutral-100 hover:border-neutral-200"
                      }`}
                  >
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4">
                      <Image src={style.image} alt={style.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      {selectedStyle === style.id && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg">
                            <Check className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-3 pb-3">
                      <h4 className="font-bold text-neutral-900">{style.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{style.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-12 rounded-xl px-8 gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedStyle || isGenerating}
                  className="h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl px-8 gap-2 shadow-lg"
                >
                  {isGenerating ? "Magic in progress..." : "Generate AI Magic"}
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Result */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-neutral-100 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div id="mockup-container" className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-50 shadow-inner group">
                    {/* Product Background Mockup */}
                    {productData?.data?.thumbnail && (
                      <img
                        src={productData.data.thumbnail}
                        alt="Product Mockup"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    )}

                    {/* AI Generated Design Overlay (Interactive Canvas) */}
                    <div className="absolute inset-0 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full h-full"
                      >
                        <DynamicMockupCanvas imageUrl={generatedImageUrl} />
                      </motion.div>
                    </div>

                    {/* Gradient Overlay for realism */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none z-20"></div>

                    <div className="absolute top-4 left-4 z-30">
                      <Badge className="bg-primary text-white border-none px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3" />
                        Live Preview
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden border-2 border-white shadow-md">
                      <Image src={originalImageUrl} alt="Original" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Original Photo</p>
                      <p className="text-xs text-neutral-500">Transformed to {selectedStyle}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                      <Check className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                      Your unique gift is <br /> <span className="text-primary underline decoration-primary/30">ready for checkout.</span>
                    </h2>
                    <p className="text-neutral-500">
                      You&apos;ve successfully personalized this product. You can now add it to your cart or try another style.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={async () => {
                        if (!productData?.data) return;

                        // Show loading state optionally, or just await
                        const toastId = toast.loading("Saving your design...");

                        let finalThumbnail = productData.data.thumbnail;
                        const container = document.getElementById("mockup-container");

                        if (container) {
                          try {
                            // Hide the UI elements before capture
                            const badge = container.querySelector(".absolute.top-4.left-4");
                            if (badge) (badge as HTMLElement).style.display = "none";

                            const dataUrl = await toPng(container, { cacheBust: true, pixelRatio: 2, skipFonts: true });

                            // Convert dataUrl to File and upload to Cloudinary
                            const blob = await (await fetch(dataUrl)).blob();
                            const file = new File([blob], `mockup-${Date.now()}.png`, { type: "image/png" });
                            const formData = new FormData();
                            formData.append("image", file);

                            const uploadRes = await uploadImage(formData).unwrap();
                            if (uploadRes.success) {
                              finalThumbnail = uploadRes.data.url;
                            } else {
                              finalThumbnail = dataUrl; // fallback
                            }

                            if (badge) (badge as HTMLElement).style.display = "block";
                          } catch (err) {
                            console.error("Failed to capture or upload mockup", err);
                          }
                        }

                        dispatch(addToCart({
                          id: `${productId}-${selectedStyle}-${Date.now()}`,
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
                        router.push("/cart");
                      }}
                      className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 gap-3"
                    >
                      <Gift className="w-5 h-5" />
                      Add to Cart with this Design
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-full h-14 rounded-2xl font-bold text-lg gap-2"
                    >
                      Try Different Style
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
