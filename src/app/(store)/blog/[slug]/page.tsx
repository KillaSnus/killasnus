import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Clock, ArrowLeft, User, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (e) {
    console.warn('Prisma query in BlogPostPage:', e);
  }

  // Fallback post
  if (!post) {
    if (slug === 'guide-to-nicotine-pouch-strengths') {
      post = {
        title: 'The Ultimate Guide to Nicotine Pouch Strengths: How to Choose',
        slug,
        excerpt: 'Confused by mg/g vs mg per pouch? Learn how to calculate the real strength and pick the right level for your needs.',
        authorName: 'Snus Specialist Team',
        readTime: 4,
        createdAt: new Date('2026-08-10'),
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80',
        content: `
          Nicotine pouches have revolutionized how adults enjoy nicotine without tobacco smoke, ash, or tar. But when browsing a store, one of the most common questions is: **How do I understand pouch strength?**

          ## Milligrams per Gram (mg/g) vs Milligrams per Pouch (mg/pouch)

          Most Scandinavian manufacturers list strength in two formats:
          1. **mg/g (Concentration):** The density of nicotine per gram of plant fiber filler.
          2. **mg/pouch (Total dose):** The exact weight of nicotine contained in one individual pouch.

          Because a standard slim pouch weighs roughly **0.7g to 0.8g**, a 16mg/g can contains approximately **11.2mg to 12.8mg of nicotine per pouch**.

          ## Strength Categories Explained

          - **Light (4 - 8 mg/g):** Ideal for adult social smokers or those transitioning down. Gentle tingling and smooth flavor.
          - **Medium (9 - 14 mg/g):** The sweet spot for most daily users. Balanced kick with lasting release.
          - **Strong (15 - 20 mg/g):** The classic Scandinavian standard (e.g. Killa Cold Mint, Velo Freeze). Noticeable burn and energetic rush.
          - **Ultra Strong (50+ mg/g):** Engineered strictly for experienced consumers (e.g. Pablo Ice Cold). Maximum voltage and immediate adrenaline.

          ## How to Pick Your Best Match

          If you are new to all-white pouches, we always recommend starting at **Medium (9-14mg/g)**. Listen to your body and adjust up or down depending on satisfaction.
        `,
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-gold-400 mb-8 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>

        {/* Post Header */}
        <div className="space-y-4 mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
            {post.category?.name || 'Guide & Analysis'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-b border-zinc-800 pb-6">
            <span className="flex items-center gap-1.5 text-zinc-200">
              <User className="h-3.5 w-3.5 text-gold-400" /> {post.authorName}
            </span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gold-400" /> {post.readTime} min read
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-10 border border-zinc-800 shadow-2xl">
            <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="rounded-3xl bg-[#111114] border border-zinc-800 p-8 sm:p-12 shadow-xl">
          <div className="prose prose-invert prose-gold max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}

