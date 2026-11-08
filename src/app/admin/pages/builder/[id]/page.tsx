'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  Save,
  Settings,
  Code,
  Layout,
  Sliders,
  Image as ImageIcon,
  Grid,
  ShoppingBag,
  Award,
  Clock,
  BookOpen,
  HelpCircle,
  Star,
  Mail,
  Check,
} from 'lucide-react';

interface BlockItem {
  id: string;
  type:
    | 'Hero'
    | 'Slider'
    | 'Banner'
    | 'Grid'
    | 'Product Carousel'
    | 'Brand Carousel'
    | 'Countdown'
    | 'Blog Grid'
    | 'FAQ'
    | 'HTML'
    | 'CSS'
    | 'JavaScript'
    | 'Reviews'
    | 'Newsletter';
  title: string;
  config: Record<string, any>;
}

const availableBlockTypes = [
  { type: 'Hero', icon: Layout, desc: 'High-impact headline banner with CTA' },
  { type: 'Slider', icon: Sliders, desc: 'Multi-slide rotating promotional showcase' },
  { type: 'Banner', icon: ImageIcon, desc: 'Static promotional callout with image' },
  { type: 'Grid', icon: Grid, desc: 'Multi-column feature layout' },
  { type: 'Product Carousel', icon: ShoppingBag, desc: 'Dynamic product scroller' },
  { type: 'Brand Carousel', icon: Award, desc: 'Nordic brand crest showcase' },
  { type: 'Countdown', icon: Clock, desc: 'Urgent flash-deal timer ticker' },
  { type: 'Blog Grid', icon: BookOpen, desc: 'Latest articles & guides' },
  { type: 'FAQ', icon: HelpCircle, desc: 'Expandable accordion questions' },
  { type: 'Reviews', icon: Star, desc: 'Customer testimonials & star ratings' },
  { type: 'Newsletter', icon: Mail, desc: 'Email subscription signup card' },
  { type: 'HTML', icon: Code, desc: 'Raw custom HTML embed' },
  { type: 'CSS', icon: Code, desc: 'Scoped custom stylesheet block' },
  { type: 'JavaScript', icon: Code, desc: 'Dynamic custom client script' },
];

export default function PageBuilderView() {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.id as string;

  const [pageTitle, setPageTitle] = useState('Custom Landing Page');
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: 'b-1',
      type: 'Hero',
      title: 'Hero Showcase',
      config: { headline: 'THE ULTIMATE POUCH COLLECTION', subhead: '100% Tobacco-Free Scandinavian Snus' },
    },
    {
      id: 'b-2',
      type: 'Countdown',
      title: 'Flash Sale Timer',
      config: { hours: 12, offerText: 'Buy 5 Cans, Get 1 FREE' },
    },
    {
      id: 'b-3',
      type: 'Product Carousel',
      title: 'Bestseller Carousel',
      config: { category: 'Popular', limit: 8 },
    },
    {
      id: 'b-4',
      type: 'Brand Carousel',
      title: 'Official Brands',
      config: { brands: ['Killa', 'Pablo', 'Velo', 'ZYN', 'Iceberg'] },
    },
    {
      id: 'b-5',
      type: 'FAQ',
      title: 'Frequently Asked Questions',
      config: { questionsCount: 4 },
    },
    {
      id: 'b-6',
      type: 'Newsletter',
      title: 'VIP Club Signup',
      config: { discount: '10% OFF' },
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState<BlockItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddBlock = (type: any) => {
    const newBlock: BlockItem = {
      id: `block-${Date.now()}`,
      type,
      title: `${type} Block`,
      config: {},
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...blocks];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setBlocks(copy);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const copy = [...blocks];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setBlocks(copy);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlock?.id === id) setSelectedBlock(null);
  };

  const handleSavePage = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pageId,
          title: pageTitle,
          blocks,
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-6 lg:-m-8">
      {/* Top Builder Control Bar */}
      <div className="h-16 bg-[#0c0c0f] border-b border-zinc-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="bg-transparent font-bold text-white text-sm focus:outline-none focus:border-b border-gold-500"
            />
            <span className="text-[10px] text-zinc-500 block">Drag & Drop Visual Page Builder</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePage}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-extrabold uppercase tracking-wider transition shadow"
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4" /> Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Blocks'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Builder Workspace: Sidebar (Palette) + Canvas + Config Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Available Blocks Palette */}
        <div className="w-72 bg-[#0c0c0f] border-r border-zinc-800 p-4 overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block mb-3">
            Available Blocks (14)
          </span>

          <div className="space-y-1.5">
            {availableBlockTypes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleAddBlock(item.type)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-left transition flex items-center gap-3 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-gold-400 transition">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.type}</span>
                    <span className="text-[10px] text-zinc-500 block leading-tight">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Live Page Canvas */}
        <div className="flex-1 bg-[#070709] p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`group relative rounded-2xl p-5 border transition cursor-pointer ${
                  selectedBlock?.id === block.id
                    ? 'border-gold-500 bg-[#141419] shadow-lg shadow-gold-500/10'
                    : 'border-zinc-800 bg-[#101014] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gold-400 font-mono">#{idx + 1}</span>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                        {block.type} Block
                      </h4>
                      <span className="text-[11px] text-zinc-400">{block.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(idx);
                      }}
                      disabled={idx === 0}
                      className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(idx);
                      }}
                      disabled={idx === blocks.length - 1}
                      className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-rose-400 ml-2"
                      title="Delete block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mini Preview Mock */}
                <div className="mt-3 p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
                  {JSON.stringify(block.config)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Block Properties Editor */}
        <div className="w-80 bg-[#0c0c0f] border-l border-zinc-800 p-5 overflow-y-auto">
          {selectedBlock ? (
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gold-400 block">
                {selectedBlock.type} Properties
              </span>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Block Title</label>
                <input
                  type="text"
                  value={selectedBlock.title}
                  onChange={(e) => {
                    const updated = { ...selectedBlock, title: e.target.value };
                    setSelectedBlock(updated);
                    setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                />
              </div>

              {selectedBlock.type === 'Hero' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline</label>
                    <input
                      type="text"
                      value={selectedBlock.config.headline || ''}
                      onChange={(e) => {
                        const updated = {
                          ...selectedBlock,
                          config: { ...selectedBlock.config, headline: e.target.value },
                        };
                        setSelectedBlock(updated);
                        setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
                      }}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </>
              )}

              {['HTML', 'CSS', 'JavaScript'].includes(selectedBlock.type) && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Custom Code Content
                  </label>
                  <textarea
                    rows={8}
                    value={selectedBlock.config.code || ''}
                    onChange={(e) => {
                      const updated = {
                        ...selectedBlock,
                        config: { ...selectedBlock.config, code: e.target.value },
                      };
                      setSelectedBlock(updated);
                      setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
                    }}
                    placeholder={`Enter ${selectedBlock.type} code...`}
                    className="w-full rounded-xl bg-black border border-zinc-800 p-3 text-xs text-gold-400 font-mono"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
              <Settings className="h-8 w-8 mb-2 opacity-40" />
              <span>Select any block on the canvas to configure its settings.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

