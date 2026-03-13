'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import CryptoPayment from '@/components/CryptoPayment';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, {role: 'user', content: userMessage}]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai-consultant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMessage, locale: 'ru'})
      });

      const data = await response.json();
      setMessages(prev => [...prev, {role: 'assistant', content: data.response}]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Ошибка подключения к серверу. Убедитесь, что API запущен (порт 8000).'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Globe Audit Hub</h1>
            </div>
            <nav className="flex gap-4">
              <a href="/en" className="text-slate-400 hover:text-white transition text-sm">EN</a>
              <a href="/ru" className="text-slate-400 hover:text-white transition text-sm">RU</a>
              <a href="/bg" className="text-slate-400 hover:text-white transition text-sm">BG</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            {t('Home.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('Home.subtitle')}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <div className="text-6xl mb-4">💼</div>
                <p className="text-lg">{t('Chat.placeholder')}</p>
                <p className="text-sm mt-2">Пример: «Посчитай налог 100000 рублей УСН 6%»</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('Chat.placeholder')}
                className="flex-1 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition flex items-center gap-2"
              >
                <span>{t('Chat.send')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMessage(t('Chat.examples.usn6') + ' 100000 рублей')}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-left transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-white font-medium">{t('Chat.examples.usn6')}</div>
            <div className="text-slate-500 text-sm">100 000 рублей</div>
          </button>
          <button
            onClick={() => setMessage(t('Chat.examples.ndfl13') + ' 150000 рублей')}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-left transition"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="text-white font-medium">{t('Chat.examples.ndfl13')}</div>
            <div className="text-slate-500 text-sm">150 000 рублей</div>
          </button>
          <button
            onClick={() => setMessage(t('Chat.examples.whatIsUSN'))}
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-left transition"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-white font-medium">{t('Chat.examples.whatIsUSN')}</div>
            <div className="text-slate-500 text-sm">Узнать подробнее</div>
          </button>
        </div>

        {/* Crypto Payment Section */}
        <CryptoPayment />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 Globe Audit Hub. {t('Nav.about')} {t('Nav.contact').toLowerCase()}.
        </div>
      </footer>
    </main>
  );
}
