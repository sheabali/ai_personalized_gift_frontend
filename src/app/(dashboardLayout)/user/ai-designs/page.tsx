"use client";

import { useGetMyDesignsQuery, useDeleteDesignMutation } from "@/redux/api/aiDesignApi";
import { useTrackShareMutation } from "@/redux/api/referralApi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Palette, Repeat, Trash2, PlusCircle, Share2, Copy, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MyAiDesignsPage() {
  const { data: designsRes, isLoading } = useGetMyDesignsQuery(undefined);
  const [deleteDesign, { isLoading: isDeleting }] = useDeleteDesignMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingDesign, setSharingDesign] = useState<any>(null);
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [trackShare, { isLoading: isSharing }] = useTrackShareMutation();

  const handleShare = async (platform: string) => {
    if (!sharingDesign) return;
    try {
      const res = await trackShare({
        designId: sharingDesign.id,
        platform,
      }).unwrap() as any;

      if (res.success && res.data) {
        setGeneratedCoupon(res.data.couponCode);

        // Construct share URL
        const shareUrl = `${window.location.origin}/products/${sharingDesign.productId}?aiDesignId=${sharingDesign.id}`;

        // Open social media tabs
        if (platform === "facebook") {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        } else if (platform === "twitter") {
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out my awesome AI design on GiftAI!")}`, "_blank");
        } else if (platform === "whatsapp") {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my awesome AI design on GiftAI: " + shareUrl)}`, "_blank");
        } else if (platform === "copy") {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Share link copied to clipboard!");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to share design");
    }
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSharingDesign(null);
    setGeneratedCoupon(null);
    setCopiedCode(false);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDesign(id).unwrap();
      toast.success("Design deleted successfully");
    } catch (err) {
      toast.error("Failed to delete design");
    } finally {
      setDeletingId(null);
    }
  };

  const designs = designsRes?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-sora">My AI Designs</h1>
      </div>

      {designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border border-neutral-100 p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Palette className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-sora mb-2">No designs yet</h2>
          <p className="text-neutral-500 max-w-md mb-8">
            You haven't generated any AI designs yet. Go to the products page and click "Customize with AI" to start creating!
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design: any) => (
            <Card key={design.id} className="overflow-hidden border-neutral-100 shadow-sm hover:shadow-md transition-all group rounded-2xl">
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <Image
                  src={design.generatedImage}
                  alt="AI Design"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-neutral-900 border-none backdrop-blur-sm px-3 py-1 font-semibold">
                  <Palette className="w-3 h-3 mr-1 inline-block text-primary" />
                  {design.styleType}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image
                      src={design.product.thumbnail}
                      alt={design.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Original Product</p>
                    <p className="font-bold text-sm text-neutral-900 line-clamp-1">{design.product.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Prompt</p>
                  <p className="text-sm text-neutral-700 italic line-clamp-2">"{design.prompt}"</p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link href={`/ai-design?productId=${design.productId}&aiDesignId=${design.id}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-xl flex items-center justify-center gap-2">
                      <Repeat className="w-4 h-4" />
                      Reorder
                    </Button>
                  </Link>
                  <Link href={`/products?aiDesignId=${design.id}`} className="w-full">
                    <Button className="w-full rounded-xl flex items-center justify-center gap-2">
                      <PlusCircle className="w-4 h-4" />
                      Apply New
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl flex items-center justify-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 mt-1"
                  onClick={() => {
                    setSharingDesign(design);
                    setShareModalOpen(true);
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share & Earn
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  onClick={() => handleDelete(design.id)}
                  disabled={isDeleting && deletingId === design.id}
                >
                  {isDeleting && deletingId === design.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Delete Design
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Design Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={(open) => !open && handleCloseShareModal()}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white border border-neutral-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-sora text-center">
              {generatedCoupon ? "🎉 Reward Earned!" : "Share & Earn Discount"}
            </DialogTitle>
          </DialogHeader>

          {generatedCoupon ? (
            <div className="space-y-6 py-4 text-center">
              <p className="text-sm text-neutral-500">
                You successfully shared your design and earned a <strong>10% OFF</strong> coupon code!
              </p>

              <div className="flex items-center justify-between bg-rose-50/50 p-4 rounded-xl border-2 border-dashed border-rose-200">
                <span className="font-mono font-bold text-xl text-rose-600 tracking-wider">
                  {generatedCoupon}
                </span>
                <Button
                  size="sm"
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedCoupon);
                    setCopiedCode(true);
                    toast.success("Coupon code copied!");
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                >
                  {copiedCode ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copiedCode ? "Copied" : "Copy"}
                </Button>
              </div>

              <p className="text-xs text-neutral-400">
                Apply this coupon at checkout. Valid for 30 days.
              </p>
              
              <Button onClick={handleCloseShareModal} className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white">
                Awesome, Got it
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <p className="text-sm text-neutral-500 text-center">
                Choose a platform to share your custom design. Once you share, you will immediately get a <strong>10% discount coupon</strong>!
              </p>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleShare("facebook")}
                  disabled={isSharing}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Facebook
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  disabled={isSharing}
                  className="w-full h-11 bg-neutral-950 hover:bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-2 font-semibold border border-neutral-950"
                >
                  <Share2 className="w-4 h-4" />
                  Share on X (Twitter)
                </Button>
                <Button
                  onClick={() => handleShare("whatsapp")}
                  disabled={isSharing}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  Share on WhatsApp
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  disabled={isSharing}
                  variant="outline"
                  className="w-full h-11 rounded-xl flex items-center justify-center gap-2 font-semibold border-neutral-200"
                >
                  <Copy className="w-4 h-4" />
                  Copy Share Link
                </Button>
              </div>

              {isSharing && (
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating reward coupon...
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
