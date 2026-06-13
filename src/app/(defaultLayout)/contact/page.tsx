"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent. We'll reply within 24 hours.");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const contactInfos = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@giftai.com",
      subText: "Expect a response within 24 hours.",
    },
    {
      icon: Phone,
      label: "Phone Support",
      value: "+880 1700-000000",
      subText: "Available for ordering queries.",
    },
    {
      icon: MapPin,
      label: "Our Headquarters",
      value: "Uttara Sector 3, Road 4, House 12",
      subText: "Dhaka, Bangladesh",
    },
    {
      icon: Clock,
      label: "Support Hours",
      value: "9:00 AM - 6:00 PM (GMT+6)",
      subText: "Sunday to Thursday (Closed on Friday & Saturday)",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 text-lg"
          >
            Have a question about your order, custom AI options, or printing details? Drop us a line.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs space-y-8">
              <h2 className="text-2xl font-bold text-neutral-900">Contact Information</h2>
              <div className="space-y-6">
                {contactInfos.map((info, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{info.label}</p>
                      <p className="font-bold text-neutral-900">{info.value}</p>
                      <p className="text-xs text-neutral-500">{info.subText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Send us a Message</h2>
                <p className="text-neutral-500 text-sm mt-1">We typically reply within a single business day.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-neutral-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Question about design styles"
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Type your message here..."
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-neutral-200 gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
