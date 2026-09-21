// Single source of truth for business details used in structured data (JSON-LD).
// Only facts already published on the site live here. Do NOT add ratings,
// review counts, licence numbers or opening hours unless they are real and
// shown on the site - Google can penalise structured data that doesn't match
// what visitors can see.

export const SITE_URL = 'https://easybcon.com.au'

// Suburbs EBC works in (supplied by the owner, 20 Sept 2026). Add or remove here
// and the Areas page, business schema and service-page schema all update.
export const SERVICE_AREAS = [
  { name: 'Bayswater', postcode: '3153' },
  { name: 'Blackburn', postcode: '3130' },
  { name: 'Blackburn North', postcode: '3130' },
  { name: 'Boronia', postcode: '3155' },
  { name: 'Croydon', postcode: '3136' },
  { name: 'Croydon South', postcode: '3136' },
  { name: 'Ferntree Gully', postcode: '3156' },
  { name: 'Forest Hill', postcode: '3131' },
  { name: 'Glen Waverley', postcode: '3150' },
  { name: 'Heathmont', postcode: '3135' },
  { name: 'Kilsyth', postcode: '3137' },
  { name: 'Kilsyth South', postcode: '3137' },
  { name: 'Lysterfield', postcode: '3156' },
  { name: 'Mitcham', postcode: '3132' },
  { name: 'Ringwood', postcode: '3134' },
  { name: 'Rowville', postcode: '3178' },
  { name: 'Scoresby', postcode: '3179' },
  { name: 'The Basin', postcode: '3154' },
  { name: 'Vermont', postcode: '3133' },
  { name: 'Wantirna', postcode: '3152' },
  { name: 'Wantirna South', postcode: '3152' },
]

export const BUSINESS = {
  name: 'Easy Building & Construction',
  legalName: 'Easy Building & Construction Pty Ltd',
  phone: '1300 715 840',
  email: 'info@easybcon.com.au',
  logo: `${SITE_URL}/logo-icon.png`,
  image: `${SITE_URL}/hero-melbourne-home-build.jpg`,
  address: {
    '@type': 'PostalAddress',
    postOfficeBoxNumber: '2014',
    addressLocality: 'Forest Hill',
    addressRegion: 'VIC',
    postalCode: '3131',
    addressCountry: 'AU',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: "Melbourne's Eastern Suburbs, Victoria" },
    ...SERVICE_AREAS.map((a) => ({
      '@type': 'Place',
      name: a.name,
      address: { '@type': 'PostalAddress', addressLocality: a.name, postalCode: a.postcode, addressRegion: 'VIC', addressCountry: 'AU' },
    })),
  ],
  sameAs: [
    'https://www.instagram.com/easybcon.com.au/',
    'https://www.linkedin.com/company/easybcon',
    'https://www.facebook.com/easybcon.com.au',
    'https://www.youtube.com/@EBC2010AUS',
    'https://x.com/easybcon',
  ],
}

export const ORG_ID = `${SITE_URL}/#organization`

// Site-wide graph: the business itself + the website. Rendered once in layout.js.
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': ORG_ID,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE_URL,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        logo: BUSINESS.logo,
        image: BUSINESS.image,
        description:
          'Registered Melbourne home builder specialising in home renovations, home extensions and new home builds across the Eastern Suburbs.',
        address: BUSINESS.address,
        areaServed: BUSINESS.areaServed,
        sameAs: BUSINESS.sameAs,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Building services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home renovations', url: `${SITE_URL}/renovation` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home extensions', url: `${SITE_URL}/extension` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'New home building', url: `${SITE_URL}/new-home` } },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.legalName,
        inLanguage: 'en-AU',
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

// Service schema for a landing page (renovation / extension / new-home).
export function serviceSchema({ path, name, serviceType, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: `${SITE_URL}${path}`,
    provider: { '@id': ORG_ID },
    areaServed: BUSINESS.areaServed,
  }
}

// Only use with FAQs that are visibly shown on the same page.
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}
