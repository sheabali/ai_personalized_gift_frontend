"use client";

import { useGetAllProductsQuery } from "@/redux/api/productApi";
import ProductCard from "@/components/module/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Gift, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Zap,
  Image as ImageIcon,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: productData, isLoading } = useGetAllProductsQuery({ isActive: true });
  const featuredProducts = productData?.data?.slice(0, 4) || [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm font-bold text-neutral-900 border border-neutral-200">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Personalized with AI Magic</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.1]">
                Turn your <span className="text-primary underline decoration-primary/20 decoration-8">memories</span> into unique art gifts.
              </h1>
              <p className="text-xl text-neutral-500 max-w-lg leading-relaxed">
                Upload a photo, choose an AI style, and get a personalized gift that stays forever. From anime portraits to 3D cartoons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="h-16 px-10 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-bold shadow-2xl shadow-neutral-200 gap-3">
                  <Link href="/products">
                    Explore Collections
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-neutral-200 text-lg font-bold gap-2">
                  <Link href={featuredProducts.length > 0 ? `/ai-design?productId=${featuredProducts[0].id}` : "/products"}>
                    Try AI Magic
                    <Zap className="w-5 h-5 text-primary" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-8">
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-neutral-100">
                          <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="User" width={48} height={48} />
                       </div>
                    ))}
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-1 text-yellow-400">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-sm font-bold text-neutral-900">5,000+ Happy Customers</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square md:aspect-[4/5] lg:aspect-square"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] -rotate-6"></div>
               <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image 
                    src="/images/hero-gift.jpg" 
                    alt="AI Personalized Gift" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                           <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">AI Result</p>
                           <p className="font-extrabold text-neutral-900">Anime Portrait</p>
                        </div>
                     </div>
                     <Badge className="bg-green-500 text-white border-none px-3 py-1 rounded-full text-[10px] font-bold">READY</Badge>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-neutral-100 bg-neutral-50/30">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Truck, text: "Free Global Shipping" },
                { icon: ShieldCheck, text: "Secure Payment" },
                { icon: Heart, text: "100% Satisfaction" },
                { icon: Gift, text: "Premium Packaging" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <p className="font-bold text-neutral-900 text-sm md:text-base">{item.text}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">Featured Collections</h2>
              <p className="text-neutral-500 max-w-lg text-lg">Hand-picked items that our community loves. Every product is AI-ready.</p>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl px-6 h-12 group">
               <Link href="/products" className="flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </Button>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-3xl animate-pulse" />)}
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
             </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
         <div className="container mx-auto">
            <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center text-white">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
               
               <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to create some magic?</h2>
                  <p className="text-neutral-400 text-lg">Join thousands of people making their loved ones smile with AI-personalized gifts.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Button asChild className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-2xl shadow-primary/20 gap-3">
                        <Link href="/register">
                           Get Started Free
                           <ArrowRight className="w-5 h-5" />
                        </Link>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </div>
  );
}
