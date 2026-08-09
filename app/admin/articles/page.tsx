'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AdminArticlesCMSPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Article Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Composition Tips');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newArt: Article = {
      id: `art-${Date.now()}`,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      excerpt,
      content,
      coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      category,
      author: {
        name: 'Elena Rostova',
        role: 'Master Juror',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '6 min read',
      tags: ['Guide', 'Photography'],
    };

    setArticles((prev) => [newArt, ...prev]);
    setIsModalOpen(false);
    showToast('Article Published', `"${title}" is now live in the guides hub.`, 'success');
  };

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Article Deleted', 'Article has been removed.', 'info');
  };

  const columns = [
    {
      header: 'Article Title',
      cell: (a: Article) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.coverImage} alt={a.title} className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-bold text-white text-xs line-clamp-1">{a.title}</p>
            <p className="text-[11px] text-primary-400">{a.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Author',
      cell: (a: Article) => <span className="text-xs text-slate-300">{a.author.name}</span>,
    },
    {
      header: 'Published Date',
      cell: (a: Article) => <span className="font-mono text-xs text-slate-300">{formatDate(a.publishedAt)}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (a: Article) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/articles/${a.slug}`}>
            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white" title="View Public">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button
            onClick={() => handleDelete(a.id)}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
            title="Delete article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Articles & Guides CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish educational articles, composition tips, and juror field advice.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Write Article
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <Input
          placeholder="Search articles by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(a) => a.id} />

      {/* Write Article Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Photography Guide" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Composition Tips', label: 'Composition Tips' },
              { value: 'Wildlife Photography', label: 'Wildlife Photography' },
              { value: 'Portrait Lighting', label: 'Portrait Lighting' },
              { value: 'Street Photography', label: 'Street Photography' },
              { value: 'Editing Guides', label: 'Editing Guides' },
            ]}
          />
          <Textarea label="Short Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
          <Textarea label="Article Markdown Content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} required />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Guide
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
