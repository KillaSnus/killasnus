import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Blog & Nicotine Pouch Guides | KILLASNUS',
  description: 'In-depth reviews, strength comparisons, flavor guides, and industry news about Scandinavian nicotine pouches.',
};

export default async function BlogIndexPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  } catch (e) {
    console.warn('Prisma error in BlogIndexPage:', e);
  }

  if (posts.length === 0) {
    posts = [
      {
        id: 'b-1',
        title: 'The Ultimate Guide to Nicotine Pouch Strengths: How to Choose',
        slug: 'guide-to-nicotine-pouch-strengths',
        excerpt:
          'Confused by mg/g vs mg per pouch? Learn how to calculate the real strength and pick the right level for your needs.',
        authorName: 'Snus Specialist Team',
        readTime: 4,
        createdAt: new Date('2026-08-10'),
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
        category: { name: 'Guides' },
      },
      {
        id: 'b-2',
        title: 'Top 5 Mint Flavours Ranked: From Arctic Freeze to Sweet Spearmint',
        slug: 'top-5-mint-flavours-ranked',
        excerpt:
          'We put Velo, Killa, Pablo and White Fox mint pouches head to head in our comprehensive taste and burn test.',
        authorName: 'Editorial Staff',
        readTime: 5,
        createdAt: new Date('2026-08-01'),
        featuredImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
        category: { name: 'Reviews' },
      },
      {
        id: 'b-3',
        title: 'Tobacco-Free vs Traditional Snus: What You Need to Know',
        slug: 'tobacco-free-vs-traditional-snus',
        excerpt:
          'Why modern white nicotine pouches have taken over the market without yellowing teeth or producing smoke.',
        authorName: 'Dr. Henrik Lindqvist',
        readTime: 6,
        createdAt: new Date('2026-07-20'),
        featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        category: { name: 'Science' },
      },
    ];
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 flex items-center justify-center gap-1.5">
            <BookOpen className="h-4 w-4" /> The Snus Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            Guides, Reviews & News
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Expert insights into European nicotine pouches, strength calculations, and new flavor reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl bg-[#111114] border border-zinc-800 overflow-hidden hover:border-gold-500/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {post.category && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-gold-400 border border-gold-500/30">
                    {post.category.name}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold uppercase text-gold-400">
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

