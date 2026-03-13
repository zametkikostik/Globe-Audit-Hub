import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "Globe Audit Hub - Профессиональная Бухгалтерия и Аудит",
  description: "Комплексные бухгалтерские и аудиторские услуги для России, Европы, США, СНГ, Азии. Профессиональная отчетность и консультации.",
  keywords: "бухгалтерия, аудит, бухгалтерские отчеты, международная бухгалтерия, налоговая отчетность, НДС, A7A5, блокчейн",
  authors: [{ name: "Globe Audit Hub" }],
  openGraph: {
    title: "Globe Audit Hub - Профессиональная Бухгалтерия и Аудит",
    description: "Комплексные бухгалтерские и аудиторские услуги",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: { 
          colorPrimary: '#3b82f6',
          colorBackground: '#0f172a',
          colorText: '#ffffff',
          colorTextSecondary: '#94a3b8',
          colorInputBackground: '#1e293b',
          colorInputText: '#ffffff',
          borderRadius: '1rem'
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
          card: 'bg-slate-900/80 backdrop-blur-xl border border-white/10',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
          formFieldInput: 'bg-white/5 border border-white/10 text-white',
          footerActionLink: 'text-blue-400 hover:text-blue-300'
        }
      }}
    >
      <html lang="ru" suppressHydrationWarning>
        <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
