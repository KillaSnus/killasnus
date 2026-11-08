import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ProductDetailView } from './ProductDetailView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found | KILLASNUS',
    };
  }

  return {
    title: product.seoTitle || `${product.name} | KILLASNUS`,
    description: product.seoDesc || product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: [product.featuredImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: {
          orderBy: { packSize: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          isPublished: true,
          id: { not: product.id },
          OR: [
            { brandId: product.brandId },
            { flavor: product.flavor },
            { strength: product.strength },
          ],
        },
        take: 4,
        include: { brand: true },
      });
    }
  } catch (e) {
    console.warn('Prisma error in ProductDetailPage:', e);
  }

  // Fallback for fallback mock data if DB empty
  if (!product) {
    if (slug === 'killa-cold-mint-16mg' || slug === 'killa-cold-mint') {
      product = {
        id: 'p-1',
        name: 'Killa Cold Mint 16mg',
        slug: 'killa-cold-mint-16mg',
        sku: 'KIL-CM-16',
        barcode: '4751025580012',
        description:
          'Killa Cold Mint is one of the most recognized and requested nicotine pouches across Europe. Offering an invigorating rush of arctic menthol and spearmint, it delivers an instant release of clean nicotine without any tobacco or smoke. Slim white pouches fit discreetly under the lip.',
        shortDescription: 'The iconic ice cold mint blend with an instant 16mg/g punch.',
        price: 4.49,
        comparePrice: 5.99,
        stock: 500,
        weight: 30,
        featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        ],
        strength: 'Strong',
        strengthMg: 16,
        flavor: 'Mint & Ice',
        pouchesPerCan: 20,
        format: 'Slim',
        isPublished: true,
        brand: { name: 'Killa', slug: 'killa' },
        variants: [
          { id: 'v-1', name: '1 Can (Single)', price: 4.49, comparePrice: 5.99, packSize: 1, sku: 'KIL-CM-1' },
          { id: 'v-10', name: 'Roll of 10 Cans (10% OFF)', price: 40.40, comparePrice: 44.90, packSize: 10, sku: 'KIL-CM-10' },
          { id: 'v-30', name: 'Box of 30 Cans (15% OFF)', price: 114.50, comparePrice: 134.70, packSize: 30, sku: 'KIL-CM-30' },
        ],
        reviews: [
          {
            id: 'r-1',
            authorName: 'Alex M.',
            rating: 5,
            title: 'Classic strong pouch, perfect burn',
            content: 'Always keep a roll of Killa Cold Mint in stock. Clean mint flavor that lasts 45 minutes.',
            isVerifiedPurchase: true,
            createdAt: new Date(),
          },
        ],
      };
    } else {
      notFound();
    }
  }

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}

