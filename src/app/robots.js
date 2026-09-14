export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/portal',
          '/portal/',
          '/login',
          '/login/',
          '/leads',
          '/leads/',
          '/design',
          '/design/',
          '/book',
          '/book/',
          '/unsubscribe',
          '/unsubscribe/',
        ],
      },
    ],
    sitemap: 'https://easybcon.com.au/sitemap.xml',
  }
}
