import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  if (featured) {
    return (
      <div className="group relative bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:border-slate-700 transition-all duration-300">
        <div className="relative h-64 lg:h-full w-full overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white shadow-lg">
              Featured Guide
            </span>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="text-primary-400 font-semibold">{article.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors leading-snug">
              {article.title}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-primary-500/30"
              />
              <div>
                <p className="text-xs font-bold text-white">{article.author.name}</p>
                <p className="text-[10px] text-slate-400">{article.author.role}</p>
              </div>
            </div>

            <Link
              href={`/articles/${article.slug}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 group-hover:translate-x-1 transition-all"
            >
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-950/80 text-primary-300 border border-white/10 backdrop-blur-md">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
            {article.author.name}
          </span>
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1"
        >
          <span>Read</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
