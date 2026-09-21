export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private / transactional areas that should never appear in search.
        // /login and /portal are deliberately NOT blocked here: they are linked
        // from the public site, and Google can only obey their "noindex" tag
        // if it is allowed to fetch them (see the layout.js in each folder).
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
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
    host: 'https://easybcon.com.au',
  }
}
