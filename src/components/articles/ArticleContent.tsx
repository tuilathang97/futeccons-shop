'use client';

import React from 'react';
import { Article } from '@/db/schema';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  if (!article) return null;
  
  return (
    <div className="mt-8 mb-12 border-t pt-6">
      <h2 className="text-2xl font-bold mb-6">{article.title}</h2>
      <div 
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
} 