import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1';

  // Fetch all products
  let products: any[] = [];
  try {
    const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      products = data.data.data || data.data || [];
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
