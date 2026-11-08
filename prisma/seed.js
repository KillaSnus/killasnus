const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { PrismaClient, Role, CouponType, CategoryType, OrderStatus, PaymentStatus } = require('@prisma/client');

const prisma = new PrismaClient();

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const KNOWN_BRANDS = [
  'Killa', 'Pablo', 'Velo', 'ZYN', 'Iceberg', 'White Fox', 'Siberia', 'Kurwa',
  'Ace', 'Kelly White', 'Goat', 'Thor', 'Rush', '77', 'XQS', 'Zone', 'Jixx', 'Greatest',
  'Björn', 'Bjorn', 'Cuba', 'Baron', 'Dope', 'Fedrs', 'Kozmo', 'Grant', 'Lips', 'Hit',
  'Loop', 'Thunder', 'Skruf', 'General', 'Volt', 'Oden', 'Fix', 'Aroma', 'Elf'
];

function detectBrand(title, tags, vendor) {
  const combined = `${title} ${tags || ''} ${vendor || ''}`.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const bLower = b.toLowerCase();
    if (combined.includes(bLower)) {
      return b === 'Björn' ? 'Bjorn' : b;
    }
  }
  return 'Killa';
}

function detectFlavor(title, tags) {
  const combined = `${title} ${tags || ''}`.toLowerCase();
  if (combined.includes('mint') || combined.includes('ice') || combined.includes('freeze') || combined.includes('frost') || combined.includes('menthol') || combined.includes('spearmint') || combined.includes('peppermint') || combined.includes('polar')) {
    return 'Mint & Ice';
  }
  if (combined.includes('berry') || combined.includes('fruit') || combined.includes('blueberry') || combined.includes('watermelon') || combined.includes('cherry') || combined.includes('strawberry') || combined.includes('apple') || combined.includes('peach') || combined.includes('melon') || combined.includes('mango') || combined.includes('grape')) {
    return 'Fruit & Berry';
  }
  if (combined.includes('cola') || combined.includes('energy') || combined.includes('drink') || combined.includes('coffee') || combined.includes('vanilla')) {
    return 'Cola & Energy';
  }
  return 'Mint & Ice';
}

function detectStrength(title, tags) {
  const combined = `${title} ${tags || ''}`.toLowerCase();
  const mgMatch = combined.match(/(\d+)\s*mg/);
  const mg = mgMatch ? parseInt(mgMatch[1], 10) : null;

  if (mg !== null) {
    if (mg >= 45) return { strength: 'Ultra', mg };
    if (mg >= 21) return { strength: 'X-Strong', mg };
    if (mg >= 15) return { strength: 'Strong', mg };
    if (mg >= 9) return { strength: 'Medium', mg };
    return { strength: 'Light', mg };
  }

  if (combined.includes('ultra') || combined.includes('fatality') || combined.includes('extreme') || combined.includes('dangerously')) {
    return { strength: 'Ultra', mg: 50 };
  }
  if (combined.includes('x-strong') || combined.includes('extra strong') || combined.includes('styrke3')) {
    return { strength: 'X-Strong', mg: 20 };
  }
  if (combined.includes('medium') || combined.includes('styrke2') || combined.includes('styrke 2')) {
    return { strength: 'Medium', mg: 12 };
  }
  if (combined.includes('light') || combined.includes('mild') || combined.includes('styrke1')) {
    return { strength: 'Light', mg: 6 };
  }
  return { strength: 'Strong', mg: 16 };
}

async function main() {
  console.log('🌱 Starting comprehensive production database seed...');

  // 1. Create Super Admin Account
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@killasnus.com' },
    update: {},
    create: {
      firebaseUid: 'admin-master-uid',
      email: 'admin@killasnus.com',
      name: 'Super Admin',
      role: Role.ADMIN,
      tags: ['Admin', 'Staff'],
      notes: 'Initial administrative account',
    },
  });
  console.log(`✓ Admin user: ${adminUser.email}`);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Mint & Ice', slug: 'mint-ice', type: CategoryType.FLAVOUR, desc: 'Crisp spearmint, peppermint frost, and arctic menthol bursts.' },
    { name: 'Fruit & Berry', slug: 'fruit-berry', type: CategoryType.FLAVOUR, desc: 'Wild berries, juicy watermelon, passion fruit, and citrus splash.' },
    { name: 'Cola & Energy', slug: 'cola-energy', type: CategoryType.FLAVOUR, desc: 'Fizzy cola kick, iced energy drink, and sweet vanilla fizz.' },
    { name: 'Light', slug: 'light', type: CategoryType.STRENGTH, desc: '4-8 mg/g smooth nicotine release.' },
    { name: 'Medium', slug: 'medium', type: CategoryType.STRENGTH, desc: '9-14 mg/g balanced daily satisfaction.' },
    { name: 'Strong', slug: 'strong', type: CategoryType.STRENGTH, desc: '15-20 mg/g traditional Swedish strength.' },
    { name: 'X-Strong', slug: 'x-strong', type: CategoryType.STRENGTH, desc: '21-35 mg/g high intensity hit.' },
    { name: 'Ultra', slug: 'ultra', type: CategoryType.STRENGTH, desc: '50+ mg/g extreme adrenaline voltage.' },
  ];

  const categoryCache = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        type: cat.type,
        description: cat.desc,
      },
    });
    categoryCache.set(cat.name.toLowerCase(), created);
  }
  console.log(`✓ Seeded ${categoriesData.length} categories`);

  // 3. Create All 18 Brands
  const brandsData = [
    { name: 'Killa', slug: 'killa', desc: 'World famous extra strong mint and fruit pouches from Denmark.' },
    { name: 'Pablo', slug: 'pablo', desc: 'Maximum adrenaline 50mg nicotine punch for seasoned veterans.' },
    { name: 'Velo', slug: 'velo', desc: 'Pure Scandinavian quality and crisp balanced formulations.' },
    { name: 'ZYN', slug: 'zyn', desc: 'The global market benchmark in all-white discreet pouches.' },
    { name: 'Iceberg', slug: 'iceberg', desc: 'Wild flavour combinations with extreme nicotine strengths.' },
    { name: 'White Fox', slug: 'white-fox', desc: 'Crafted with essential peppermint oils and fleece pouches.' },
    { name: 'Siberia', slug: 'siberia', desc: 'Legendary intensity known across the snus world.' },
    { name: 'Kurwa', slug: 'kurwa', desc: 'Explosive fruit candies and brutal energy blends.' },
    { name: 'Ace', slug: 'ace', desc: 'Ultra clean mint profile with high quality soft pouches.' },
    { name: 'Kelly White', slug: 'kelly-white', desc: 'Chic, designer flavors like sweet melon and raspberry.' },
    { name: 'Goat', slug: 'goat', desc: 'Modern slim pouches with rapid nicotine release.' },
    { name: 'Thor', slug: 'thor', desc: 'Nordic thunder strength with icy chill.' },
    { name: 'Rush', slug: 'rush', desc: 'Fast onset and long lasting fresh satisfaction.' },
    { name: '77', slug: '77', desc: 'Sleek slim nicotine pouches with rich aromatic profiles.' },
    { name: 'XQS', slug: 'xqs', desc: 'Famous for fizzy cola, blueberry mint, and cactus sour.' },
    { name: 'Zone', slug: 'zone', desc: 'Soft-feel pouch technology designed for all-day comfort.' },
    { name: 'Jixx', slug: 'jixx', desc: 'Crisp fruit & cool menthol blends.' },
    { name: 'Greatest', slug: 'greatest', desc: 'High purity nicotine pouches manufactured in Sweden.' },
    { name: 'Bjorn', slug: 'bjorn', desc: 'Scandinavian quality with balanced mint and fruit profiles.' },
    { name: 'Cuba', slug: 'cuba', desc: 'Extreme blackline and whiteline intense nicotine pouches.' },
    { name: 'Baron', slug: 'baron', desc: 'Classic European strength and premium discreet slim pouches.' },
  ];

  const brandCache = new Map();
  for (const b of brandsData) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        description: b.desc,
        isFeatured: true,
      },
    });
    brandCache.set(b.name.toLowerCase(), created);
  }
  console.log(`✓ Seeded ${brandsData.length} brands`);

  // 4. Ingest real Products CSV if present
  const productsCsvPath = path.join(__dirname, '../data/products_export_1.csv');
  if (fs.existsSync(productsCsvPath)) {
    console.log('📦 Loading real Shopify products from products_export_1.csv...');
    const prodCsv = fs.readFileSync(productsCsvPath, 'utf8');
    const parsed = Papa.parse(prodCsv, { header: true, skipEmptyLines: true });

    const productsByHandle = new Map();

    for (const row of parsed.data) {
      const handle = row['Handle'] || slugify(row['Title']);
      if (!handle) continue;

      if (!productsByHandle.has(handle)) {
        productsByHandle.set(handle, {
          handle,
          title: row['Title'] || handle,
          bodyHtml: row['Body (HTML)'] || '',
          vendor: row['Vendor'] || '',
          tags: (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
          images: [],
          variants: [],
          sku: row['Variant SKU'] || `KNS-${handle.slice(0, 8).toUpperCase()}`,
          price: parseFloat(row['Variant Price']) || 4.49,
          comparePrice: parseFloat(row['Variant Compare At Price']) || null,
          stock: parseInt(row['Variant Inventory Qty'], 10) || 100,
          weight: parseFloat(row['Variant Grams']) || 30,
        });
      }

      const p = productsByHandle.get(handle);
      if (row['Image Src'] && !p.images.includes(row['Image Src'])) {
        p.images.push(row['Image Src']);
      }

      if (row['Option1 Value'] || row['Variant SKU']) {
        const variantName = row['Option1 Value'] || 'Standard Can';
        const variantSku = row['Variant SKU'] || `${p.sku}-${p.variants.length + 1}`;
        const variantPrice = parseFloat(row['Variant Price']) || p.price;
        const variantCompare = parseFloat(row['Variant Compare At Price']) || null;
        const variantStock = parseInt(row['Variant Inventory Qty'], 10) || 100;

        if (!p.variants.some(v => v.sku === variantSku)) {
          p.variants.push({
            name: variantName,
            sku: variantSku,
            price: variantPrice,
            comparePrice: variantCompare,
            stock: isNaN(variantStock) ? 100 : variantStock,
            packSize: variantName.toLowerCase().includes('10') ? 10 : variantName.toLowerCase().includes('30') ? 30 : 1,
          });
        }
      }
    }

    let importedCount = 0;
    for (const [handle, item] of productsByHandle.entries()) {
      const brandName = detectBrand(item.title, item.tags.join(' '), item.vendor);
      let brand = brandCache.get(brandName.toLowerCase());

      if (!brand) {
        brand = await prisma.brand.upsert({
          where: { slug: slugify(brandName) },
          update: {},
          create: {
            name: brandName,
            slug: slugify(brandName),
            description: `Authentic ${brandName} Scandinavian nicotine pouches.`,
            isFeatured: true,
          },
        });
        brandCache.set(brandName.toLowerCase(), brand);
      }

      const flavor = detectFlavor(item.title, item.tags.join(' '));
      const { strength, mg } = detectStrength(item.title, item.tags.join(' '));
      const category = categoryCache.get(flavor.toLowerCase()) || null;

      const featuredImage = item.images[0] || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80';
      const galleryImages = item.images.slice(0, 5);

      const description = item.bodyHtml
        ? item.bodyHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000)
        : `${item.title} premium nicotine pouches. 100% tobacco-free with rapid nicotine absorption.`;

      const shortDescription = `${brandName} ${flavor} (${strength} ${mg ? `${mg}mg/g` : ''})`;

      try {
        await prisma.product.upsert({
          where: { slug: handle },
          update: {
            name: item.title,
            sku: item.sku,
            price: item.price,
            comparePrice: item.comparePrice,
            stock: item.stock > 0 ? item.stock : 150,
            featuredImage,
            galleryImages,
            brandId: brand ? brand.id : null,
            categoryId: category ? category.id : null,
            flavor,
            strength,
            strengthMg: mg,
            tags: item.tags,
            description,
            shortDescription,
          },
          create: {
            name: item.title,
            slug: handle,
            sku: item.sku,
            price: item.price,
            comparePrice: item.comparePrice,
            stock: item.stock > 0 ? item.stock : 150,
            weight: item.weight || 30,
            featuredImage,
            galleryImages,
            brandId: brand ? brand.id : null,
            categoryId: category ? category.id : null,
            flavor,
            strength,
            strengthMg: mg,
            tags: item.tags,
            description,
            shortDescription,
            pouchesPerCan: 20,
            format: 'Slim',
            isPublished: true,
            isPopular: importedCount % 8 === 0,
            variants: {
              create: item.variants.length > 0 ? item.variants.map(v => ({
                name: v.name,
                sku: v.sku,
                price: v.price,
                comparePrice: v.comparePrice,
                stock: v.stock,
                packSize: v.packSize,
              })) : [
                { name: '1 Can (Single)', sku: `${item.sku}-1`, price: item.price, comparePrice: item.comparePrice, packSize: 1, stock: 100 },
                { name: 'Roll of 10 Cans (10% OFF)', sku: `${item.sku}-10`, price: parseFloat((item.price * 9).toFixed(2)), comparePrice: parseFloat((item.price * 10).toFixed(2)), packSize: 10, stock: 50 },
              ],
            },
          },
        });
        importedCount++;
      } catch (err) {
        // continue
      }
    }
    console.log(`✓ Seeded ${importedCount} authentic products from products_export_1.csv`);
  }

  // 5. Ingest real Customers CSV if present
  const customersCsvPath = path.join(__dirname, '../data/customers_export.csv');
  if (fs.existsSync(customersCsvPath)) {
    console.log('👥 Loading real Shopify customers from customers_export.csv...');
    const custCsv = fs.readFileSync(customersCsvPath, 'utf8');
    const parsed = Papa.parse(custCsv, { header: true, skipEmptyLines: true });

    let custCount = 0;
    const seenEmails = new Set();

    for (const row of parsed.data) {
      const email = (row['Email'] || '').trim().toLowerCase();
      if (!email || !email.includes('@') || seenEmails.has(email)) continue;
      seenEmails.add(email);

      const firstName = row['First Name'] || '';
      const lastName = row['Last Name'] || '';
      const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0];
      const phone = row['Phone'] || row['Default Address Phone'] || null;
      const notes = row['Note'] ? String(row['Note']).trim() : null;
      const tags = (row['Tags'] || '')
        .split(',')
        .map(t => t.trim())
        .filter(t => t && !t.includes('Inbox online store chat') && !t.includes('June 30 2026'));

      const totalSpent = parseFloat(row['Total Spent']) || 0;
      const totalOrders = parseInt(row['Total Orders'], 10) || 0;

      if (totalSpent > 100) tags.push('VIP');
      if (totalOrders > 3) tags.push('Repeat Customer');

      const address1 = row['Default Address Address1'] || null;
      const city = row['Default Address City'] || null;
      const postalCode = row['Default Address Zip'] || null;
      const country = row['Default Address Country Code'] || 'GB';

      try {
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            name: fullName,
            phone: phone ? String(phone).replace(/'/g, '') : undefined,
            tags,
            notes: notes ? `Notes: ${notes} | Total Spent: £${totalSpent}` : undefined,
          },
          create: {
            firebaseUid: `cust_${row['Customer ID'] ? String(row['Customer ID']).replace(/'/g, '') : custCount}_${Date.now()}`,
            email,
            name: fullName,
            phone: phone ? String(phone).replace(/'/g, '') : null,
            role: Role.CUSTOMER,
            tags,
            notes: notes ? `Customer Note: ${notes} | Historical spend: £${totalSpent}` : null,
          },
        });

        if (address1 && city && postalCode) {
          await prisma.address.create({
            data: {
              userId: user.id,
              firstName: firstName || 'Valued',
              lastName: lastName || 'Customer',
              address1,
              address2: row['Default Address Address2'] || null,
              city,
              postalCode: String(postalCode).replace(/'/g, ''),
              country,
              phone: phone ? String(phone).replace(/'/g, '') : null,
              isDefault: true,
            },
          }).catch(() => {});
        }
        custCount++;
      } catch (err) {
        // continue
      }
    }
    console.log(`✓ Seeded ${custCount} authentic customers from customers_export.csv`);
  }

  // 6. Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: CouponType.PERCENTAGE,
      discountValue: 10,
      minSpend: 20,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE10' },
    update: {},
    create: {
      code: 'SAVE10',
      discountType: CouponType.FIXED_AMOUNT,
      discountValue: 10,
      minSpend: 50,
      isActive: true,
    },
  });

  // 7. Initial Logo and Footer Settings
  await prisma.storeSetting.upsert({
    where: { key: 'logo_settings' },
    update: {},
    create: {
      key: 'logo_settings',
      value: {
        mode: 'TEXT', // 'IMAGE' or 'TEXT'
        imageUrl: '',
        imageWidth: 160,
        imageHeight: 40,
        textPrefix: 'KILLA',
        textSuffix: 'SNUS',
        tagline: 'LUXURY POUCHES',
        goldAccent: true,
      },
    },
  });

  await prisma.storeSetting.upsert({
    where: { key: 'footer_settings' },
    update: {},
    create: {
      key: 'footer_settings',
      value: {
        aboutText: 'The premier destination for authentic Scandinavian nicotine pouches. Tobacco-free, smoke-free, and spit-free. Direct delivery from certified European manufacturers.',
        copyrightText: `© ${new Date().getFullYear()} KILLASNUS. All rights reserved. Original Design.`,
        disclaimerText: 'This product contains nicotine. Nicotine is an addictive chemical. Not suitable for individuals under 18 years of age, pregnant or breastfeeding women, or people with cardiovascular disease. Keep out of reach of children and pets.',
        supportEmail: 'support@killasnus.com',
        socialLinks: {
          instagram: 'https://instagram.com',
          twitter: 'https://x.com',
          telegram: 'https://t.me',
          whatsapp: 'https://whatsapp.com',
        },
        paymentBadges: ['VISA', 'Mastercard', 'Apple Pay', 'PayPal', 'Crypto'],
      },
    },
  });

  console.log('✅ Production database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
