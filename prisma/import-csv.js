const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { PrismaClient, Role, CategoryType } = require('@prisma/client');

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

// Brand detection list
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
  
  // Look for mg/g patterns (e.g. 50mg, 150 mg/g, 16mg)
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

async function importAll() {
  console.log('🚀 Starting ingestion of real Shopify Products & Customers...');

  // --- PART 1: PRODUCTS IMPORT ---
  const productsCsvPath = path.join(__dirname, '../data/products_export_1.csv');
  if (fs.existsSync(productsCsvPath)) {
    console.log('📦 Parsing products_export_1.csv...');
    const prodCsv = fs.readFileSync(productsCsvPath, 'utf8');
    const parsed = Papa.parse(prodCsv, { header: true, skipEmptyLines: true });
    console.log(`Found ${parsed.data.length} product rows.`);

    // Group rows by handle
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

    console.log(`Aggregated ${productsByHandle.size} unique products.`);

    // Cache categories & brands in memory
    const brandCache = new Map();
    const existingBrands = await prisma.brand.findMany();
    existingBrands.forEach(b => brandCache.set(b.name.toLowerCase(), b));

    const categoryCache = new Map();
    const existingCategories = await prisma.category.findMany();
    existingCategories.forEach(c => categoryCache.set(c.name.toLowerCase(), c));

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

      // Clean HTML or fallback text
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
            pouchesPerCan: 20,
            format: 'Slim',
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
        if (importedCount % 100 === 0) {
          console.log(`Processed ${importedCount} / ${productsByHandle.size} products...`);
        }
      } catch (err) {
        // Continue silently on duplicates
      }
    }

    console.log(`✅ Successfully imported ${importedCount} authentic products!`);
  }

  // --- PART 2: CUSTOMERS IMPORT ---
  const customersCsvPath = path.join(__dirname, '../data/customers_export.csv');
  if (fs.existsSync(customersCsvPath)) {
    console.log('👥 Parsing customers_export.csv...');
    const custCsv = fs.readFileSync(customersCsvPath, 'utf8');
    const parsed = Papa.parse(custCsv, { header: true, skipEmptyLines: true });
    console.log(`Found ${parsed.data.length} customer records.`);

    let customerCount = 0;
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
            firebaseUid: `cust_${row['Customer ID'] ? String(row['Customer ID']).replace(/'/g, '') : customerCount}_${Date.now()}`,
            email,
            name: fullName,
            phone: phone ? String(phone).replace(/'/g, '') : null,
            role: Role.CUSTOMER,
            tags,
            notes: notes ? `Customer Note: ${notes} | Historical spend: £${totalSpent}` : null,
          },
        });

        // Add saved address if address1 and city exist
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

        customerCount++;
        if (customerCount % 300 === 0) {
          console.log(`Processed ${customerCount} customers...`);
        }
      } catch (err) {
        // Continue silently on duplicate uids
      }
    }

    console.log(`✅ Successfully imported ${customerCount} authentic customers!`);
  }
}

importAll()
  .catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

