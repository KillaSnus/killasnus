import Papa from 'papaparse';

export function parseCSV<T = Record<string, string>>(csvString: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvString, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

export function generateCSV<T extends Record<string, any>>(data: T[]): string {
  return Papa.unparse(data, {
    quotes: true,
    header: true,
  });
}

export interface MappedProductImport {
  name: string;
  slug?: string;
  sku: string;
  barcode?: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  weight?: number;
  brandName?: string;
  categoryName?: string;
  tags: string[];
  featuredImage: string;
  galleryImages: string[];
  strength?: string;
  flavor?: string;
  pouchesPerCan?: number;
}

export function mapShopifyProductCSV(rows: Record<string, string>[]): MappedProductImport[] {
  const productsByHandle: Record<string, MappedProductImport> = {};

  for (const row of rows) {
    const handle = row['Handle'] || row['handle'] || row['Slug'] || row['slug'];
    const title = row['Title'] || row['title'] || row['Name'] || row['name'];
    const bodyHtml = row['Body (HTML)'] || row['Description'] || row['description'] || '';
    const vendor = row['Vendor'] || row['Brand'] || row['brand'] || 'Killa';
    const type = row['Type'] || row['Category'] || row['category'] || 'Nicotine Pouches';
    const tags = (row['Tags'] || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const sku = row['Variant SKU'] || row['SKU'] || row['sku'] || `KNS-${Date.now()}`;
    const price = parseFloat(row['Variant Price'] || row['Price'] || row['price'] || '0') || 4.99;
    const comparePrice = parseFloat(
      row['Variant Compare At Price'] || row['Compare Price'] || '0'
    ) || undefined;
    const stock = parseInt(row['Variant Inventory Qty'] || row['Stock'] || '100', 10);
    const imageSrc = row['Image Src'] || row['Image'] || row['featuredImage'] || '';

    // Extract strength and flavor from tags or title
    let strength = 'Strong';
    let flavor = 'Mint & Ice';

    for (const tag of tags) {
      const lower = tag.toLowerCase();
      if (['light', 'medium', 'strong', 'x-strong', 'ultra'].includes(lower)) {
        strength = tag;
      }
      if (['mint & ice', 'fruit & berry', 'cola & energy'].includes(lower)) {
        flavor = tag;
      }
    }

    const key = handle || title;
    if (!key) continue;

    if (!productsByHandle[key]) {
      productsByHandle[key] = {
        name: title || 'Nicotine Pouch',
        slug: handle,
        sku,
        description: bodyHtml || title || 'Premium quality nicotine pouches.',
        shortDescription: title,
        price,
        comparePrice,
        stock: isNaN(stock) ? 100 : stock,
        brandName: vendor,
        categoryName: type,
        tags,
        featuredImage: imageSrc || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
        galleryImages: imageSrc ? [imageSrc] : [],
        strength,
        flavor,
        pouchesPerCan: 20,
      };
    } else {
      if (imageSrc && !productsByHandle[key].galleryImages.includes(imageSrc)) {
        productsByHandle[key].galleryImages.push(imageSrc);
      }
    }
  }

  return Object.values(productsByHandle);
}

export function mapShopifyCustomerCSV(rows: Record<string, string>[]) {
  return rows.map((row) => ({
    email: row['Email'] || row['email'] || '',
    firstName: row['First Name'] || row['firstName'] || '',
    lastName: row['Last Name'] || row['lastName'] || '',
    phone: row['Phone'] || row['phone'] || '',
    tags: (row['Tags'] || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    notes: row['Note'] || row['notes'] || '',
  })).filter((c) => !!c.email);
}

