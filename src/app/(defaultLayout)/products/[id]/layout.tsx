import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

async function getProduct(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (error) {
    console.error("Error fetching product metadata:", error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailsLayout({ params, children }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  let jsonLd = null;
  if (product) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.thumbnail,
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.id}`,
        "priceCurrency": "BDT",
        "price": product.discountPrice || product.price,
        "availability": "https://schema.org/InStock"
      }
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
