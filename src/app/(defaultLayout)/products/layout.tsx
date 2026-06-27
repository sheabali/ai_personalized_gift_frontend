import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our collection of AI personalizable products. Choose from T-shirts, mugs, hoodies, and more to create your unique AI gift.',
  openGraph: {
    title: 'All Products | GiftAI',
    description: 'Browse our collection of AI personalizable products.',
    url: '/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
