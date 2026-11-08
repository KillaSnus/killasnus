'use client';

import React, { useState } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Package,
  Users,
  ShoppingCart,
  Layers,
  Award,
  BookOpen,
  FileText,
} from 'lucide-react';

const exportTypes = [
  { id: 'products', label: 'Products CSV', desc: 'Shopify-compatible products, variants, SKUs & pricing', icon: Package },
  { id: 'customers', label: 'Customers CSV', desc: 'Customer directory, contact details, tags and spend notes', icon: Users },
  { id: 'orders', label: 'Orders CSV', desc: 'Full order history, customer lines, fulfillment statuses', icon: ShoppingCart },
  { id: 'categories', label: 'Categories CSV', desc: 'Taxonomy, flavours, and nested strengths hierarchy', icon: Layers },
  { id: 'brands', label: 'Brands CSV', desc: 'All 18+ brands directory with descriptions and logos', icon: Award },
  { id: 'blogs', label: 'Blog Posts CSV', desc: 'All published articles, authors, tags, and guides', icon: BookOpen },
  { id: 'pages', label: 'CMS Pages CSV', desc: 'All CMS pages, legal policies, and builder metadata', icon: FileText },
];

export default function AdminImportExportPage() {
  const [importType, setImportType] = useState('products');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleRunImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', importType);

      const res = await fetch('/api/import-export', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setImportResult({
        success: true,
        message: data.message || `Imported successfully!`,
      });
      setSelectedFile(null);
    } catch (err: any) {
      setImportResult({
        success: false,
        message: err.message || 'Import error occurred',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Data Center</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
          Universal CSV Import & Export
        </h1>
        <p className="text-xs text-zinc-400">
          Seamlessly migrate and back up Products, Customers, Orders, Brands, Categories, and CMS content.
          Fully compatible with Shopify exports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CSV Import Card */}
        <div className="lg:col-span-6 rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-extrabold uppercase text-sm">
            <Upload className="h-4 w-4 text-gold-400" />
            <h2>Import CSV Data</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Upload Shopify product exports (`products_export_1.csv`) or customer exports (`customers_export.csv`).
          </p>

          <form onSubmit={handleRunImport} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Entity</label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                <option value="products">Products (with variants & tags)</option>
                <option value="customers">Customers (with notes & spend)</option>
                <option value="brands">Brands</option>
                <option value="categories">Categories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Select CSV File</label>
              <div className="border-2 border-dashed border-zinc-800 hover:border-gold-500/40 rounded-xl p-6 text-center cursor-pointer bg-zinc-900/40">
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={handleFileChange}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-gold-400"
                />
                <span className="text-[11px] text-zinc-500 block mt-2">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Supports UTF-8 CSV exports'}
                </span>
              </div>
            </div>

            {importResult && (
              <div
                className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs ${
                  importResult.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-800 text-rose-400'
                }`}
              >
                {importResult.success ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{importResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-400 py-3 text-xs font-extrabold text-black uppercase tracking-wider transition shadow disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Processing Import...' : `Import ${importType.toUpperCase()} CSV`}
            </button>
          </form>
        </div>

        {/* CSV Export Card */}
        <div className="lg:col-span-6 rounded-2xl bg-[#111114] border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-extrabold uppercase text-sm">
            <Download className="h-4 w-4 text-gold-400" />
            <h2>Export CSV Data</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Download production snapshots in standard CSV format for spreadsheets, backups, or external reporting.
          </p>

          <div className="space-y-2.5 pt-2">
            {exportTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-gold-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.label}</h4>
                      <p className="text-[10px] text-zinc-500">{item.desc}</p>
                    </div>
                  </div>

                  <a
                    href={`/api/import-export?type=${item.id}`}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-gold-500 hover:text-black text-xs font-bold text-zinc-300 transition"
                  >
                    <Download className="h-3 w-3" /> Export
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

