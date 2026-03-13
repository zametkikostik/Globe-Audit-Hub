'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-white">Globe Audit Hub</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#services" className="text-slate-400 hover:text-white transition">Услуги</Link>
              <Link href="/#about" className="text-slate-400 hover:text-white transition">О нас</Link>
              <Link href="/#regions" className="text-slate-400 hover:text-white transition">Регионы</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white transition">Блог</Link>
              <Link href="/#contact" className="text-slate-400 hover:text-white transition">Контакты</Link>
            </div>

            <div className="flex items-center gap-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="text-slate-300 hover:text-white transition">Вход</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl transition">Регистрация</button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10 rounded-xl',
                        userButtonPopoverCard: 'bg-slate-900 border border-white/10',
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Профессиональная{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Бухгалтерия
              </span>{' '}
              и Аудит
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Комплексные бухгалтерские и аудиторские услуги для России, Европы, США, СНГ, Азии.
              Профессиональная отчётность и консультации с использованием блокчейн технологий.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-2xl transition transform hover:scale-105">
                    Начать работу
                  </button>
                </SignUpButton>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-2xl transition transform hover:scale-105"
                >
                  Перейти в Dashboard
                </Link>
              )}
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl transition"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section 
        id="services"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 px-6 bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white text-center mb-12">Наши Услуги</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Regions */}
      <motion.section 
        id="regions"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white text-center mb-12">Регионы Работы</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {regions.map((region, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center hover:bg-white/10 transition"
              >
                <div className="text-4xl mb-2">{region.flag}</div>
                <div className="text-sm text-slate-300">{region.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About */}
      <motion.section 
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 px-6 bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white text-center mb-12">О Компании</motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <p className="text-lg text-slate-300 mb-6">
                Globe Audit Hub — это современная бухгалтерская компания с использованием 
                передовых технологий блокчейн и искусственного интеллекта.
              </p>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section 
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Связаться с Нами</h2>
          <p className="text-slate-400 text-center mb-12">
            Оставьте заявку и мы свяжемся с вами в течение 15 минут
          </p>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h3>
              <p className="text-slate-400">Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Имя *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Сообщение</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Опишите вашу задачу..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition"
              >
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold text-white">Globe Audit Hub</span>
              </div>
              <p className="text-slate-400 text-sm">
                Профессиональная бухгалтерия и аудит с использованием блокчейн технологий.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/#services" className="hover:text-white transition">Бухгалтерия</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">Аудит</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">Налоги</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">Консультации</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/#about" className="hover:text-white transition">О нас</Link></li>
                <li><Link href="/#regions" className="hover:text-white transition">Регионы</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Блог</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">Admin Panel</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📧 intelligent.swallow.aybm@mask.me</li>
                <li>🌍 Работаем по всему миру</li>
                <li>🕐 24/7 поддержка</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2026 Globe Audit Hub. Все права защищены.
          </div>
        </div>
      </footer>
    </main>
  );
}

const services = [
  { icon: '📊', title: 'Бухгалтерское Обслуживание', description: 'Полное ведение бухгалтерии для ИП и ООО. Сдача отчётности в налоговую.' },
  { icon: '🔍', title: 'Аудит', description: 'Независимая проверка финансовой отчётности. Выявление ошибок и рисков.' },
  { icon: '💰', title: 'Налоговое Планирование', description: 'Оптимизация налогообложения. Подбор оптимального налогового режима.' },
  { icon: '🌍', title: 'Международная Отчётность', description: 'МСФО, GAAP. Отчётность для зарубежных партнёров и регуляторов.' },
  { icon: '🔐', title: 'Блокчейн Верификация', description: 'Верификация платежей и отчётов через блокчейн Polygon. Неизменяемость данных.' },
  { icon: '🤖', title: 'AI Консультант', description: 'Автоматические консультации по налоговым вопросам 24/7.' }
];

const regions = [
  { flag: '🇷🇺', name: 'Россия' },
  { flag: '🇰🇿', name: 'Казахстан' },
  { flag: '🇧🇾', name: 'Беларусь' },
  { flag: '🇺🇦', name: 'Украина' },
  { flag: '🇺🇿', name: 'Узбекистан' },
  { flag: '🇩🇪', name: 'Германия' },
  { flag: '🇫🇷', name: 'Франция' },
  { flag: '🇬🇧', name: 'Великобритания' },
  { flag: '🇺🇸', name: 'США' },
  { flag: '🇨🇳', name: 'Китай' }
];

const features = [
  'Более 10 лет опыта на рынке',
  'Работа в 10+ странах мира',
  'Блокчейн верификация всех отчётов',
  'AI-консультант 24/7',
  'Интеграция с банками и налоговыми органами'
];

const stats = [
  { number: '5000+', label: 'Клиентов' },
  { number: '10+', label: 'Стран' },
  { number: '15000+', label: 'Отчётов' },
  { number: '99%', label: 'Успеха' }
];
