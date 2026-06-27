import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

async function getBlogPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api/v1";
  try {
    const res = await fetch(`${apiUrl}/blog-posts/slug/${slug}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (error) {
    console.error("Error fetching blog post layout metadata:", error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const seoTitle = post.metaTitle || `${post.title} | GiftAI Blog`;
  const seoDescription = post.metaDescription || post.summary || "Curated gift guide by GiftAI";
  const seoKeywords = post.keywords || [];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author],
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function BlogPostLayout({ params, children }: Props) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  let jsonLd = null;
  if (post) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.thumbnail ? [post.thumbnail] : [],
      "datePublished": post.publishedAt || post.createdAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Organization",
        "name": post.author || "AI Personalized Gift Team",
        "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      },
      "description": post.summary || post.metaDescription,
      "publisher": {
        "@type": "Organization",
        "name": "GiftAI",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`
        }
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
