import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Guides & Inspiration | GiftAI Blogs",
  description:
    "Find the best personalized gift guides, ideas, and inspiration for Valentine's Day, birthdays, anniversaries, and special holidays.",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
