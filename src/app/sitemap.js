export default function sitemap() {
  const base = 'https://easybcon.com.au'
  const now = new Date()

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/new-home`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/renovation`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/extension`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
