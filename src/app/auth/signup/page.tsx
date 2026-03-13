import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="text-2xl font-bold text-white">Globe Audit Hub</span>
        </Link>

        {/* Clerk Sign Up */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-none p-0',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-slate-400',
                socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
                socialButtonsBlockButtonText: 'text-white',
                dividerLine: 'bg-white/10',
                dividerText: 'text-slate-400',
                formFieldLabel: 'text-slate-400',
                formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-blue-500',
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
                footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium'
              }
            }}
          />
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-slate-400 transition">← Вернуться на главную</Link>
        </p>
      </div>
    </main>
  );
}
