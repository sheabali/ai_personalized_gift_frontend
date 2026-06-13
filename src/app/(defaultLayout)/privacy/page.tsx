"use client";

import { Shield } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const sections = [
    { id: "intro", label: "1. Introduction" },
    { id: "data-collection", label: "2. Data We Collect" },
    { id: "ai-processing", label: "3. AI Processing & Storage" },
    { id: "data-sharing", label: "4. Third-Party Sharing" },
    { id: "security", label: "5. Data Security" },
    { id: "your-rights", label: "6. Your Privacy Rights" },
    { id: "contact", label: "7. Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-neutral-400 font-medium">Last updated: June 14, 2026</p>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Shield className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Table of Contents Sticky Sidebar */}
          <div className="md:col-span-4 sticky top-24 hidden md:block">
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-2">Table of Contents</p>
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm font-semibold text-neutral-500 hover:text-primary hover:bg-neutral-50 py-2.5 px-3 rounded-xl transition-all"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Policy Document Content */}
          <div className="md:col-span-8 bg-white rounded-3xl p-8 md:p-10 border border-neutral-100 shadow-sm space-y-8 text-neutral-600 leading-relaxed text-sm md:text-base">
            
            <section id="intro" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">1. Introduction</h2>
              <p>
                Welcome to GiftAI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We operate the GiftAI platform and are committed to protecting your personal information and your right to privacy. 
              </p>
              <p>
                This Privacy Policy governs the collection, use, and disclosure of details collected from users who access our services, customize custom products, or upload graphics to generate AI designs.
              </p>
            </section>

            <section id="data-collection" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">2. Data We Collect</h2>
              <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or make purchases.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Credentials:</strong> Name, Email, password, and profile data.</li>
                <li><strong>Billing & Shipping:</strong> Physical address, phone number, and payment references (handled securely via SSLCommerz or Stripe).</li>
                <li><strong>User-Uploaded Media:</strong> Portrait photos or reference graphics that you upload for the purpose of AI style customization.</li>
              </ul>
            </section>

            <section id="ai-processing" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">3. AI Processing & Storage</h2>
              <p>
                We use advanced image generation APIs (like Pollinations AI and Replicate) to apply custom artistic filters (such as Anime, Cartoon, or Sketch) to the photos you upload.
              </p>
              <p>
                <strong>Important Photo Retention details:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your uploaded original photos are processed via temporary buffers to perform style generation.</li>
                <li>Generated customized graphics are uploaded to our secure Cloudinary repository to render live previews and store them in your checkout cart.</li>
                <li>We do not utilize your uploaded images to train general AI models or for any marketing purpose without your express consent.</li>
              </ul>
            </section>

            <section id="data-sharing" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">4. Third-Party Sharing</h2>
              <p>
                We only share information with third-party service providers to facilitate payment gateways (Stripe/SSLCommerz), process AI imagery (Cloudinary/Pollinations), or manage print-on-demand fulfillment.
              </p>
              <p>
                We do not sell, rent, or trade your personal information or uploaded graphics to any marketing brokers.
              </p>
            </section>

            <section id="security" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">5. Data Security</h2>
              <p>
                We implement a variety of security measures, including HTTPS encryption and rate limiting on API endpoints, to maintain the safety of your personal data when you place an order or upload photos.
              </p>
            </section>

            <section id="your-rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">6. Your Privacy Rights</h2>
              <p>Depending on your location, you may have the right to request access to the personal data we hold about you, request corrections, or request complete deletion of your account and uploaded designs.</p>
              <p>To exercise these rights, please reach out to our privacy officer via our contact channels.</p>
            </section>

            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">7. Contact Us</h2>
              <p>If you have any questions or concerns about this policy or your data, you can email us at:</p>
              <p className="font-bold text-neutral-900">privacy@giftai.com</p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
