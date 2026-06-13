"use client";

import { FileText } from "lucide-react";
import React from "react";

export default function TermsPage() {
  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "accounts", label: "2. User Accounts" },
    { id: "ai-terms", label: "3. AI Usage & Licensing" },
    { id: "payment", label: "4. Payments & Billing" },
    { id: "returns", label: "5. Shipping & Return Policy" },
    { id: "liability", label: "6. Limitation of Liability" },
    { id: "changes", label: "7. Changes to Terms" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Terms of Service</h1>
            <p className="text-sm text-neutral-400 font-medium">Last updated: June 14, 2026</p>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <FileText className="w-8 h-8" />
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
            
            <section id="acceptance" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using GiftAI website and purchasing custom AI products, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section id="accounts" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">2. User Accounts</h2>
              <p>
                To customize designs and place orders, you must create a registered account. You are responsible for keeping your account credentials secure and confidential.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that generate illegal, offensive, or copyright-violating imagery via our prompt interface.
              </p>
            </section>

            <section id="ai-terms" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">3. AI Usage & Licensing</h2>
              <p>
                GiftAI enables you to generate custom images using prompts and uploaded source photos. 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You maintain ownership rights over the source photos you upload.</li>
                <li>You are granted a worldwide, non-exclusive, royalty-free license to download, use, and print the generated AI designs for personal use.</li>
                <li>You agree not to use the generated designs to engage in defamation, hate speech, or intellectual property infringement.</li>
              </ul>
            </section>

            <section id="payment" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">4. Payments & Billing</h2>
              <p>
                All prices for custom posters, frames, mugs, and digital designs are displayed on our platform. 
              </p>
              <p>
                We use secure billing processors. By inputting your payment credentials, you authorize us to bill the specified amount for your orders. All transaction processing is encrypted via SSL protocols.
              </p>
            </section>

            <section id="returns" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">5. Shipping & Return Policy</h2>
              <p>
                <strong>Personalized Products:</strong> Because every product features your unique custom AI art, we cannot offer returns or refunds for change-of-mind reasons.
              </p>
              <p>
                <strong>Damages or Errors:</strong> If your print-on-demand product arrives damaged, misprinted, or defective, please contact us within 7 days of delivery with photos of the package, and we will issue a free replacement or a full refund.
              </p>
            </section>

            <section id="liability" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">6. Limitation of Liability</h2>
              <p>
                GiftAI will not be liable for any indirect, incidental, or consequential damages arising out of your use of the generated AI graphics or custom merchandise.
              </p>
            </section>

            <section id="changes" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-neutral-900">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the platform constitutes agreement to the updated terms.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
