import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";

import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleAnalytics from "../../components/shared/GoogleAnalytics";
import AiChatbot from "@/components/module/AiChat/AiChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "GiftAI - AI Personalized Gift Platform",
    template: "%s | GiftAI",
  },
  description: "Create personalized AI-generated gifts with anime & cartoon portraits. Shop unique, one-of-a-kind gifts powered by AI.",
  keywords: ["AI gifts", "personalized gifts", "custom t-shirts", "anime portraits", "custom mugs"],
  openGraph: {
    title: "GiftAI - AI Personalized Gift Platform",
    description: "Create personalized AI-generated gifts with anime & cartoon portraits.",
    url: "/",
    siteName: "GiftAI",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GiftAI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftAI - AI Personalized Gift Platform",
    description: "Create personalized AI-generated gifts with anime & cartoon portraits.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
        <Toaster position="top-center" richColors />
        <NextAuthSessionProvider>
          <ReduxProvider>
            {children}
            <AiChatbot />
          </ReduxProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
