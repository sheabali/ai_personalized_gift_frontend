"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAiRecommendationMutation } from "@/redux/api/aiChatApi";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
  bundles?: any[];
};

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I am your AI Gift Concierge 🎁 Tell me who you're buying a gift for, what they like, or your budget, and I'll find the perfect match!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [getRecommendation, { isLoading }] = useGetAiRecommendationMutation();
  const dispatch = useAppDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Prepare history for API (excluding products)
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await getRecommendation({ message: userMsg.content, history }).unwrap();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.reply,
        products: res.data.recommendedProducts,
        bundles: res.data.bundles,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Failed to fetch recommendation", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, my AI brain is taking a quick nap. Please try again later! 💤",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageSquare className="w-6 h-6 relative z-10" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-neutral-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px]"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">GiftAI Assistant</h3>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-neutral-200" : "bg-primary/10 text-primary"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-neutral-600" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-neutral-900 text-white rounded-tr-none" : "bg-white text-neutral-800 border border-neutral-100 shadow-sm rounded-tl-none"}`}>
                      {msg.content}
                    </div>
                    
                    {/* Render Recommended Products */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="flex flex-col gap-2 w-[260px]">
                        {msg.products.map(product => (
                          <Link key={product.id} href={`/products/${product.id}`} className="block">
                            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-primary transition-colors flex items-center p-2 gap-3 shadow-sm group">
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-neutral-900 truncate">{product.name}</p>
                                <p className="text-xs text-primary font-semibold">৳{product.price}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Render Bundles */}
                    {msg.bundles && msg.bundles.length > 0 && (
                      <div className="flex flex-col gap-3 w-[280px] mt-1">
                        {msg.bundles.map((bundle, idx) => {
                          const totalOriginalPrice = bundle.products.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
                          const discountMultiplier = bundle.discountPercentage ? (1 - bundle.discountPercentage / 100) : 1;
                          const bundlePrice = Math.round(totalOriginalPrice * discountMultiplier);

                          return (
                            <div key={idx} className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-[30px]"></div>
                              <div className="relative z-10">
                                <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-primary" /> {bundle.name}
                                </h4>
                                <p className="text-xs text-neutral-600 mt-1 mb-3 line-clamp-2">{bundle.description}</p>
                                
                                <div className="flex -space-x-3 mb-4">
                                  {bundle.products.map((p: any, i: number) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative shadow-sm z-10 bg-white">
                                      <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                                    </div>
                                  ))}
                                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative shadow-sm z-0 bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                                    +{bundle.products.length}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <div>
                                    <p className="text-xs text-neutral-400 line-through">৳{totalOriginalPrice}</p>
                                    <p className="text-sm font-bold text-primary">৳{bundlePrice}</p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="rounded-xl h-8 text-xs font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform"
                                    onClick={() => {
                                      bundle.products.forEach((p: any) => {
                                        dispatch(addToCart({
                                          id: `${p.id}-bundle-${Date.now()}`,
                                          productId: p.id,
                                          name: p.name,
                                          thumbnail: p.thumbnail,
                                          category: p.category,
                                          price: Math.round((p.price || 0) * discountMultiplier),
                                          quantity: 1,
                                          aiDesignId: null,
                                          aiDesign: null
                                        }));
                                      });
                                      toast.success(`${bundle.name} added to cart!`);
                                    }}
                                  >
                                    Add Bundle
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    <span className="text-xs text-neutral-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for gift ideas..."
                  className="pr-12 h-12 rounded-xl bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 focus:ring-primary/20 shadow-none"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
