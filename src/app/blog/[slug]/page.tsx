'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          setError('Статья не найдена');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка статьи...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-white mb-2">Статья не найдена</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link href="/blog" className="text-blue-400 hover:text-blue-300">← Вернуться к блогу</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-white">Globe Audit Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-slate-400 hover:text-white transition">Главная</Link>
              <Link href="/blog" className="text-white font-medium">Блог</Link>
              <Link href="/#contact" className="text-slate-400 hover:text-white transition">Контакты</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Назад к блогу
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                  {post.author[0]}
                </div>
                <span>{post.author}</span>
              </div>
              <span>📅 {new Date(post.created_at).toLocaleDateString('ru-RU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-5 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-6" {...props} />
                  ),
                  code: ({node, inline, ...props}: any) => (
                    inline ? 
                    <code className="bg-slate-800 px-2 py-1 rounded text-pink-400 text-sm" {...props} /> :
                    <pre className="bg-slate-800 p-4 rounded-xl overflow-x-auto text-slate-300 my-4"><code {...props} /></pre>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-between">
              <Link href="/blog" className="text-blue-400 hover:text-blue-300">
                ← Все статьи
              </Link>
              <Link
                href="/#contact"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl transition"
              >
                Связаться с нами
              </Link>
            </div>
          </motion.footer>
        </div>
      </article>
    </main>
  );
}
