import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'ru', 'bg'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // locale может быть undefined при первой загрузке
  if (!locale) {
    return {
      locale: 'en',
      messages: (await import(`../messages/en.json`)).default
    };
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
