'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
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

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white text-center mb-4"
          >
            Блог Globe Audit Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 text-center mb-12"
          >
            Новости, аналитика и руководства по бухгалтерии и аудиту
          </motion.p>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Загрузка статей...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-slate-400">Статей пока нет</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition"
                >
                  <h2 className="text-2xl font-bold text-white mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-400 transition">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-slate-400 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>✍️ {post.author}</span>
                    <span>📅 {new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
