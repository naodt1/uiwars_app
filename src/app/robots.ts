import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/room/'], // room pages are ephemeral, no value indexing them
      },
    ],
    sitemap: 'https://uiwars.app/sitemap.xml',
  };
}
