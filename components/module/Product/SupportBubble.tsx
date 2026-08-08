"use client";

import { MessageCircle } from "lucide-react";

export default function SupportBubble() {
  const phoneNumber = "09613119911";
  
  const handleSupportClick = () => {
    // Redirect to WhatsApp or phone tel link
    // Clean country code if needed (e.g. Bangladesh +880)
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const formattedNumber = cleanNumber.startsWith("0") ? `88${cleanNumber}` : cleanNumber;
    
    // Open in a new tab
    window.open(`https://wa.me/${formattedNumber}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleSupportClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#22c35e] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 animate-bounce"
        style={{ animationDuration: "3s" }}
        aria-label="Contact Customer Support"
        title="Chat with Support"
      >
        {/* Simple speech bubble icon to represent chat */}
        <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
      </button>
    </div>
  );
}
