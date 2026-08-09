'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Button } from '@/components/ui/Button';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, ArrowLeft, Share2, Tag, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { showToast } = useToast();

  const article = MOCK_ARTICLES.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
          <h2 className="text-xl font-bold">Article Not Found</h2>
          <Link href="/articles" className="mt-4">
            <Button variant="primary">Browse All Articles</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied!', 'Article URL copied to clipboard.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-10">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/articles"
            className="text-xs text-primary-300 hover:text-primary-200 transition-colors flex items-center gap-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-primary-300 border border-white/20">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-tight">
            {article.title}
          </h1>

          {/* Author Card & Share Button */}
          <div className="flex items-center justify-between pt-4 pb-2 border-y border-white/[0.08]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-primary-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{article.author.name}</h4>
                <p className="text-xs text-primary-300 font-medium">{article.author.role}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share Guide
            </Button>
          </div>
        </div>

        {/* Hero Article Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#09090b] border border-white/[0.08] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-300 leading-relaxed">
          <p className="text-lg text-zinc-200 font-medium leading-relaxed border-l-2 border-primary-400 pl-4">
            {article.excerpt}
          </p>

          <div className="space-y-4 pt-2">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-white pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1 text-zinc-300">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-zinc-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-zinc-400 mr-1" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-xl bg-[#09090b] border border-white/[0.08] text-xs text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="pt-10 space-y-6">
          <h3 className="text-xl font-bold text-white">Related Guides & Tutorials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
