"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, HelpCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  const products = [
    {
      name: "Custom Anime Mug",
      price: "$14.99",
      features: [
        "11 oz Ceramic Mug",
        "Microwave & Dishwasher safe",
        "High-definition AI render print",
        "Secure foam packaging",
        "Ships within 3 days",
      ],
      cta: "Customize Mug",
      popular: false,
    },
    {
      name: "Framed Canvas Print",
      price: "$34.99",
      features: [
        "12x12 or 16x16 inches",
        "Premium solid wood frame",
        "Stretched canvas structure",
        "UV-resistant archival inks",
        "Ready to hang layout",
      ],
      cta: "Customize Canvas",
      popular: true,
    },
    {
      name: "Custom AI T-Shirt",
      price: "$24.99",
      features: [
        "100% Ring-spun cotton",
        "Direct-to-garment (DTG) print",
        "Unisex modern retail fit",
        "Pre-shrunk soft fabric",
        "Eco-friendly inks used",
      ],
      cta: "Customize Shirt",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Are there any hidden costs for AI generation?",
      a: "No! All AI generation on our wizard page is completely free of charge. You only pay for the physical product printing and shipping when you check out.",
    },
    {
      q: "How much is shipping?",
      a: "We offer standard shipping globally. Shipping is calculated at checkout, typically ranging between $3.99 and $5.99 depending on your region. We offer free shipping on orders over $50.",
    },
    {
      q: "Can I cancel my custom order?",
      a: "Since custom orders are individualized and printed on-demand with your face, we can only cancel orders within 2 hours of payment before they enter printing queue.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 text-lg"
          >
            No subscription fees. Pay only for the physical custom printed products you order, with free AI styling included.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {products.map((prod, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-[2rem] p-8 border ${
                prod.popular ? "border-primary shadow-xl ring-2 ring-primary/10 relative" : "border-neutral-100 shadow-xs"
              } flex flex-col justify-between`}
            >
              {prod.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Most Popular
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{prod.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-neutral-900 tracking-tight">{prod.price}</span>
                    <span className="ml-1 text-sm text-neutral-400 font-medium">/ unit</span>
                  </div>
                </div>

                <ul className="space-y-4 border-t border-neutral-100 pt-6">
                  {prod.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  variant={prod.popular ? "default" : "outline"}
                  className="w-full h-12 rounded-xl font-bold transition-all duration-200 active:scale-95"
                >
                  <Link href="/products">{prod.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-100 shadow-sm max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
            <p className="text-sm text-neutral-400 mt-1">Everything you need to know about our products and pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {faqs.map((faq, fidx) => (
              <div key={fidx} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <h4 className="font-bold text-neutral-900">{faq.q}</h4>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
