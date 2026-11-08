import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ShieldCheck, ArrowRight, HelpCircle, Mail, Award } from 'lucide-react';

interface CMSPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CMSPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.cMSPage.findUnique({
    where: { slug },
  });

  if (!page) {
    return {
      title: `${slug.replace(/-/g, ' ').toUpperCase()} | KILLASNUS`,
    };
  }

  return {
    title: page.seoTitle || `${page.title} | KILLASNUS`,
    description: page.seoDesc || page.content?.slice(0, 160) || undefined,
  };
}

export default async function DynamicCMSPage({ params }: CMSPageProps) {
  const { slug } = await params;

  let page: any = null;
  try {
    page = await prisma.cMSPage.findUnique({
      where: { slug, isPublished: true },
    });
  } catch (e) {
    console.warn('Prisma error in DynamicCMSPage:', e);
  }

  // Pre-configured static templates if DB empty
  const defaultPages: Record<string, { title: string; content: string; badge: string }> = {
    'about-us': {
      title: 'About KILLASNUS',
      badge: 'Our Mission & Story',
      content: `
        KILLASNUS was founded with a singular mission: to supply adult nicotine consumers across the UK and Europe with genuine, high-purity Scandinavian nicotine pouches.

        We recognized that adult consumers demanded smoke-free, spit-free, and tobacco-free alternatives that didn't compromise on freshness, flavor, or kick. Today, we work directly with certified laboratories and factories in Sweden, Denmark, and Europe to stock over 18+ prestigious brands.

        Every product in our inventory is 100% tobacco-free, all-white, and guaranteed fresh batch with immediate tracked courier dispatch.
      `,
    },
    'wholesale': {
      title: 'Wholesale & B2B Solutions',
      badge: 'Official Distribution',
      content: `
        Are you a retail tobacconist, vape shop, convenience chain, or ecommerce platform looking to stock authentic European nicotine pouches?

        KILLASNUS Wholesale provides tiered carton and pallet-level pricing for over 18+ market-leading brands including Killa, Pablo, Velo, ZYN, Iceberg, and White Fox.

        Benefits of partnering with us:
        - Factory-direct bulk pricing & high retail margins
        - Guaranteed Scandinavian batch freshness
        - Express pallet & carton dispatch from UK/EU hubs
        - Full compliance documentation and Certificates of Analysis (CoA)

        To request our wholesale catalog and account registration, please contact wholesale@killasnus.com.
      `,
    },
    'rewards': {
      title: 'VIP Snus Rewards Program',
      badge: 'Earn & Redeem',
      content: `
        Get rewarded for every single can. As a KILLASNUS member, you earn 5 Snus Points for every £1 spent on our website.

        How it works:
        - Create an account: 100 bonus points instantly
        - Shop pouches: 5 points per £1 spent
        - Leave a verified review: 50 bonus points
        - Birthday bonus: 200 points

        Redeem points at checkout for direct order discounts:
        - 250 Points = £5 OFF
        - 500 Points = £12 OFF
        - 1,000 Points = £30 OFF
      `,
    },
    'faq': {
      title: 'Frequently Asked Questions',
      badge: 'Help & Knowledge',
      content: `
        **What are nicotine pouches?**
        Nicotine pouches are pre-portioned, all-white pouches containing pharmaceutical-grade nicotine, plant fibers, salt, and food-grade flavorings. They are 100% tobacco-free.

        **How do I use them?**
        Simply place one pouch under your upper lip between your gum and lip. You will feel a pleasant tingle as the nicotine and flavor release. Keep it there for 30 to 45 minutes, then discard it in the can's top waste compartment.

        **Do you ship discreetly?**
        Yes! All orders are shipped in plain, unbranded brown or white boxes with no mention of snus or nicotine on the exterior packaging.

        **What is the minimum age to purchase?**
        You must be at least 18 years of age (or legal age in your jurisdiction) to order from our website. Age verification is mandatory.
      `,
    },
    'payment-methods': {
      title: 'Accepted Payment Methods',
      badge: 'Secure Checkout',
      content: `
        We offer a wide variety of safe, encrypted payment options:
        - **Credit & Debit Cards:** Visa, Mastercard, American Express via Stripe.
        - **PayPal:** One-click instant checkout.
        - **Faster Payments Bank Transfer:** Direct bank transfer with automated reference matching.
        - **Cryptocurrency:** Bitcoin (BTC), Ethereum (ETH), and USDT (Tether).
        - **Cash On Delivery (COD):** Available for selected UK delivery postcodes.
      `,
    },
    'returns-policy': {
      title: 'Returns & Refund Policy',
      badge: 'Customer Satisfaction',
      content: `
        We want you to be completely satisfied with your purchase. Due to health, hygiene, and product integrity regulations for nicotine consumables:
        - Unopened, factory-sealed cans in their original condition may be returned within 14 days of receipt for a full refund or exchange.
        - Once a can seal is broken, we cannot accept returns unless the item is proven damaged in transit or defective.
        - To initiate a return, contact support@killasnus.com with your order number.
      `,
    },
    'terms-of-service': {
      title: 'Terms of Service',
      badge: 'Legal & Agreement',
      content: `
        By accessing and using this website, you agree to be bound by these Terms of Service.
        1. **Age Requirement:** You must be 18 years of age or older to purchase products.
        2. **Intended Use:** All products sold are nicotine pouches intended strictly for adult consumer recreational use.
        3. **Orders & Pricing:** We reserve the right to cancel or amend any order suspected of fraudulent activity or underage purchasing.
      `,
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      badge: 'GDPR & Privacy',
      content: `
        KILLASNUS is committed to protecting your personal data in strict compliance with the UK GDPR and Data Protection Act.
        - We collect your contact, delivery, and payment details exclusively to process and deliver your orders.
        - We never sell or rent your personal information to third parties.
        - Your payment transactions are tokenized and processed via PCI-DSS Level 1 certified gateways.
      `,
    },
  };

  const pageData = page || defaultPages[slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="bg-[#09090b] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
            {pageData.badge || 'Information Page'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            {pageData.title}
          </h1>
        </div>

        <div className="rounded-3xl bg-[#111114] border border-zinc-800 p-8 sm:p-12 shadow-2xl">
          <div className="prose prose-invert prose-gold max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line">
            {pageData.content}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              <span>Questions? Email our 24/7 team at support@killasnus.com</span>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition"
            >
              Shop Pouches <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

