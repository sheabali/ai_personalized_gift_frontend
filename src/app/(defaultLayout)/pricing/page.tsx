"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, X, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe (placeholder key, replace with environment variable)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleCheckout = async (priceId: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize.");
      
      // In a real implementation, you would call your backend API here
      // to create a Checkout Session and get the sessionId
      console.log("Processing checkout for price:", priceId);
      alert("This is a placeholder for the Stripe checkout flow.");
      
      // const response = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ priceId }) });
      // const session = await response.json();
      // await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="text-center px-4 mb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Simple Pricing for Everyone</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Choose the perfect plan to accelerate your career. No hidden fees. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            {/* Using a simple custom toggle since Switch from shadcn might not be installed, 
                but I'll assume it is, or just use a basic button toggle if it isn't. 
                Wait, I'll use a custom accessible toggle to be safe. */}
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="sr-only">Toggle annual billing</span>
              <span
                className={`${
                  isAnnual ? "translate-x-8" : "translate-x-1"
                } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annually <span className="text-xs bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 max-w-screen-xl mb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Free Plan */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-background rounded-3xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect for trying out the platform.</p>
            <div className="text-5xl font-heading font-bold mb-2">$0</div>
            <p className="text-sm text-muted-foreground mb-8">Free forever</p>
            <Button variant="outline" className="w-full mb-8 h-12 rounded-full text-lg">Get Started</Button>
            <ul className="space-y-4">
              {['Basic ATS Scoring', '1 Resume Upload', 'General Feedback', 'Community Support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-primary/5 rounded-3xl p-8 border-2 border-primary relative shadow-lg transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
            <p className="text-muted-foreground mb-6">Everything you need to land interviews.</p>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-5xl font-heading font-bold">${isAnnual ? "15" : "19"}</div>
              <div className="text-muted-foreground mb-1">/month</div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">{isAnnual ? "Billed $180 yearly" : "Billed monthly"}</p>
            <Button 
              onClick={() => handleCheckout("price_pro")} 
              className="w-full mb-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full text-lg"
            >
              Start Free Trial
            </Button>
            <ul className="space-y-4">
              {['Advanced ATS Scoring', 'Unlimited Uploads', 'Line-by-line Action Plan', 'Job Description Matching', 'Priority Email Support', 'Cover Letter Generator'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-background rounded-3xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-6">For universities and career centers.</p>
            <div className="text-5xl font-heading font-bold mb-2">Custom</div>
            <p className="text-sm text-muted-foreground mb-8">Tailored to your needs</p>
            <Button variant="outline" className="w-full mb-8 h-12 rounded-full text-lg">Contact Sales</Button>
            <ul className="space-y-4">
              {['Volume Licensing', 'White-labeling Options', 'Custom Integrations', 'Dedicated Account Manager', 'Advanced Analytics Dashboard', 'API Access'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 max-w-screen-lg mb-24 hidden md:block">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Compare Plans</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold w-1/3">Features</th>
                <th className="p-4 font-semibold text-center w-1/4">Free</th>
                <th className="p-4 font-semibold text-center w-1/4 text-primary">Pro</th>
                <th className="p-4 font-semibold text-center w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: "ATS Score Analysis", free: true, pro: true, ent: true },
                { name: "Resume Uploads", free: "1", pro: "Unlimited", ent: "Unlimited" },
                { name: "Basic Formatting Check", free: true, pro: true, ent: true },
                { name: "Keyword Optimization", free: false, pro: true, ent: true },
                { name: "Line-by-line Action Plan", free: false, pro: true, ent: true },
                { name: "Job Description Matching", free: false, pro: true, ent: true },
                { name: "Cover Letter Generator", free: false, pro: true, ent: true },
                { name: "API Access", free: false, pro: false, ent: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium">{row.name}</td>
                  <td className="p-4 text-center">
                    {typeof row.free === "boolean" ? (
                      row.free ? <CheckCircle className="w-5 h-5 mx-auto text-muted-foreground" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />
                    ) : (
                      <span className="text-sm">{row.free}</span>
                    )}
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? <CheckCircle className="w-5 h-5 mx-auto text-primary" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />
                    ) : (
                      <span className="text-sm font-semibold text-primary">{row.pro}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {typeof row.ent === "boolean" ? (
                      row.ent ? <CheckCircle className="w-5 h-5 mx-auto text-muted-foreground" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />
                    ) : (
                      <span className="text-sm">{row.ent}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted py-16 mb-24">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 text-primary shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">14-Day Guarantee</h4>
              <p className="text-sm text-muted-foreground">Not satisfied? Get a full refund within 14 days, no questions asked.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 text-primary shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Your data is encrypted. We never sell your personal information or resumes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 text-primary shadow-sm">
                <CreditCard className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Cancel Anytime</h4>
              <p className="text-sm text-muted-foreground">No long-term contracts. Pause or cancel your subscription with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 max-w-3xl mb-24">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Pricing FAQ</h2>
        <Accordion type="single" collapsible className="w-full bg-background rounded-2xl border border-border p-4 shadow-sm">
          {[
            { q: "Can I switch from Monthly to Annual later?", a: "Yes, you can upgrade to an annual plan at any time from your billing settings and the unused portion of your monthly plan will be prorated." },
            { q: "What payment methods do you accept?", a: "We accept all major credit cards including Visa, Mastercard, American Express, as well as PayPal and Apple Pay." },
            { q: "Are there any hidden fees?", a: "Absolutely not. The price you see is the price you pay. There are no setup fees, cancellation fees, or hidden charges." },
            { q: "Do you offer discounts for students?", a: "Yes! Students with a valid .edu email address are eligible for a 50% discount on the Pro plan. Contact our support team to apply." }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 max-w-screen-md text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Invest in your career today</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals who have already accelerated their job search.
        </p>
        <Button onClick={() => handleCheckout("price_pro")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl h-16 px-10 rounded-full w-full sm:w-auto">
          Start Free Trial
        </Button>
      </section>
    </div>
  );
}
