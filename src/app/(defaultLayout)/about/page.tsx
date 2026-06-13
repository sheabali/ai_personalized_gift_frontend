"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, ShieldCheck, Zap, Gift, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: "AI-Powered Customization",
      description: "We merge cutting-edge AI image generation models with custom styles to turn your photos into gorgeous art in seconds.",
    },
    {
      icon: Heart,
      title: "Made with Care",
      description: "Every canvas, mug, and custom poster is printed using premium materials and hand-inspected before leaving our shop.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      description: "Your uploaded photos are used strictly for generating your designs and are deleted from our servers automatically or saved securely.",
    },
    {
      icon: Zap,
      title: "Rapid Fulfillment",
      description: "We understand gifts are time-sensitive. We print, pack, and ship your personalized gifts within 2-4 business days.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-16">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden bg-neutral-900 text-white rounded-[2.5rem] max-w-7xl mx-auto px-6 md:px-12 mb-16 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold border border-white/10"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span>Our Story</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Turn Your Memories Into <span className="text-primary underline decoration-primary/20">Custom AI Art</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 font-medium"
          >
            At GiftAI, we believe the best gifts are the ones that tell a story. We help you create personalized, one-of-a-kind art gifts for the people you love.
          </motion.p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            How We Started
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            GiftAI was founded by a team of artists and engineers who wanted to solve the classic dilemma: finding a truly unique, personal gift that doesn&apos;t cost a fortune. 
          </p>
          <p className="text-neutral-600 leading-relaxed">
            By leveraging generative AI models, we made it possible for anyone to become an artist. Whether it&apos;s transforming your favorite photo into an expressive anime illustration, a 3D Pixar-style cartoon, or a classic pencil sketch, we render high-definition designs instantly.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            But we didn&apos;t stop at digital art. We integrated directly with local printing facilities to ensure that your custom creation gets printed onto physical gifts—like matte posters, ceramic mugs, and custom apparel—and delivered right to your doorstep.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video lg:aspect-square bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] border border-neutral-100 p-8 flex items-center justify-center shadow-sm"
        >
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">5,000+ Happy Customers</h3>
            <p className="text-neutral-500 text-sm">
              We&apos;ve helped thousands of creators, parents, and friends craft memorable keepsakes that bring smiles, tears, and joy.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-20 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">Our Core Principles</h2>
            <p className="text-neutral-500">
              We govern our design, printing, and operations around a few simple promises to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xs mb-6 group-hover:scale-110 transition-transform">
                  <val.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-neutral-900 mb-2">{val.title}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">
        <div className="bg-neutral-900 text-white rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h3 className="text-3xl font-bold">Ready to make a unique gift?</h3>
            <p className="text-neutral-400">
              Try our AI image generation styles now and customize the perfect keepsake for your loved ones.
            </p>
            <div className="pt-2">
              <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-primary/20">
                <Link href="/products">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
