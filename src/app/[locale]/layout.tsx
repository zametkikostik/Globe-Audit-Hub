import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n/request';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  
  const titles: Record<string, string> = {
    en: 'Professional Audit - Globe Audit Hub',
    ru: 'Профессиональный Аудит - Globe Audit Hub',
    bg: 'Професионален одит - Globe Audit Hub'
  };
  
  const descriptions: Record<string, string> = {
    en: 'Comprehensive audit and accounting services with AI-powered support. Calculate taxes and get instant consultations.',
    ru: 'Комплексные услуги аудита и бухгалтерии с ИИ-поддержкой. Рассчитайте налоги и получите консультацию онлайн.',
    bg: 'Комплексни одиторски и счетоводни услуги с ИИ подкрепа. Изчислете данъците и получите консултация онлайн.'
  };
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: ['аудит', 'бухгалтерия', 'налоги', 'УСН', 'НДФЛ', 'AI', 'consulting'],
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      locale
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
