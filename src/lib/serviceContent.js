// Copy for the three main service pages. Edit here - no code changes needed.
//
// Rules used when writing this (please keep to them when editing):
//  - No prices, timeframes or guarantees unless EBC can stand behind them.
//  - Anything about permits/insurance is deliberately general ("usually", "depends on")
//    because it varies by project and Victorian rules change. Have it read over by
//    someone at EBC before relying on it.
//  - FAQ answers are shown on the page AND used for FAQ structured data, so they
//    must stay identical to what visitors can read.

export const RENOVATION = {
  path: '/renovation',
  serviceName: 'Home renovations',
  serviceType: 'Home renovation',
  heading: 'Home renovations in Melbourne’s Eastern Suburbs',
  intro: [
    'Whether you are updating a single room or reworking the whole house, a renovation goes best when the plan is clear before the first tradie arrives. EBC is a registered Melbourne builder that looks after renovations from first conversation through to handover, so you deal with one team rather than juggling separate trades.',
    'We work on kitchens, bathrooms, laundries and powder rooms, open-plan changes such as wall removal, and full-home renovations.',
  ],
  servicesHeading: 'Renovations we do',
  services: [
    { title: 'Kitchen renovations', desc: 'New layouts, cabinetry, benchtops and finishes planned around how you actually cook and live.' },
    { title: 'Bathroom & powder room renovations', desc: 'Wet-area work done properly, from waterproofing and tiling through to fixtures and fit-out.' },
    { title: 'Laundry renovations', desc: 'Practical, well-organised laundries that make better use of the space you have.' },
    { title: 'Open-plan & wall removal', desc: 'Opening up living areas, including structural changes that need the right engineering and approvals.' },
    { title: 'Full-home renovations', desc: 'Bigger projects that bring several rooms together under one plan, one team and one schedule.' },
  ],
  stepsHeading: 'How your renovation works with EBC',
  steps: [
    { title: 'Register your project', desc: 'Tell us what you have in mind. It takes about a minute.' },
    { title: 'Shape the design', desc: 'Work through our Home Design Tool at your own pace so we understand what you want.' },
    { title: 'Talk it through', desc: 'Book a free consultation with a team member who already knows your project.' },
    { title: 'Build & track progress', desc: 'Follow progress from first site work to handover in your customer portal.' },
  ],
  costHeading: 'What affects the cost of a renovation?',
  costIntro: 'Every home is different, so we quote from your actual scope rather than a rule of thumb. The main things that move the price are:',
  costFactors: [
    'The size and scope of the work, and how many rooms are involved',
    'Whether walls, plumbing or electrical services need to move',
    'Structural changes, which need engineering and usually a building permit',
    'The finishes and fixtures you choose, from cabinetry and tiles to tapware',
    'The age and condition of the existing home, which can reveal extra work once walls are opened up',
    'Site access and the approvals your project needs',
  ],
  faqsHeading: 'Renovation questions homeowners ask us',
  faqs: [
    {
      q: 'Do I need a building permit to renovate in Victoria?',
      a: 'It depends on the scope. Cosmetic updates often do not need one, but structural changes such as removing or altering walls, adding openings, or work that affects the building’s structure or services commonly do. We will tell you what applies to your project when we look at your plans.',
    },
    {
      q: 'How long will my renovation take?',
      a: 'It depends on the size of the project, the selections you make and any approvals involved. Once we understand your scope we will give you an expected timeline, so you can plan around it.',
    },
    {
      q: 'Can we stay in the house during a renovation?',
      a: 'Often yes for a single kitchen, bathroom or laundry, with some temporary arrangements. Larger or whole-home renovations can make living on site difficult. We will talk through what is realistic for your project.',
    },
    {
      q: 'How do you price a renovation?',
      a: 'We quote from your specific scope after understanding what you want to achieve, so you can see what is included before you decide. Register your project and we will take you through the next steps.',
    },
    {
      q: 'Are you a registered builder?',
      a: 'Yes. EBC is a registered building practitioner and a member of Master Builders Victoria. You can check any Victorian builder’s registration with the Building and Plumbing Commission.',
    },
    {
      q: 'Which areas do you renovate in?',
      a: 'We work across Melbourne’s Eastern Suburbs, including Ringwood, Croydon, Boronia, Blackburn, Glen Waverley, Mitcham and Rowville. If you are nearby, register your project with your address and we will confirm we can help.',
    },
  ],
  related: [
    { href: '/extension', label: 'Home extensions' },
    { href: '/new-home', label: 'New home builds' },
    { href: '/blog/renovating-in-melbourne-questions', label: 'Renovating in Melbourne: the questions every homeowner asks first' },
    { href: '/blog/design-build-vs-hiring-separately', label: 'Design & build vs hiring separately' },
  ],
}

export const EXTENSION = {
  path: '/extension',
  serviceName: 'Home extensions',
  serviceType: 'Home extension',
  heading: 'Home extensions in Melbourne’s Eastern Suburbs',
  intro: [
    'If your home no longer fits your family, an extension can give you the space you need without leaving a street and neighbourhood you like. The trick is making the new part feel like it was always there: matching the existing home, and making sure the layout, approvals and build all line up.',
    'EBC is a registered Melbourne builder. We take extensions from the first design conversation through to handover, with one team responsible for the whole process.',
  ],
  servicesHeading: 'What an extension can add',
  services: [
    { title: 'More living space', desc: 'Larger family, kitchen and living areas that connect naturally to the existing home.' },
    { title: 'Extra bedrooms & bathrooms', desc: 'Room for a growing family, guests or working from home.' },
    { title: 'Designed to match your home', desc: 'Rooflines, materials and finishes considered so the extension blends with what is already there.' },
    { title: 'Extension plus renovation', desc: 'Combine the new space with updates to existing rooms so the whole home works together.' },
  ],
  stepsHeading: 'How your extension works with EBC',
  steps: [
    { title: 'Register your project', desc: 'Tell us about the space you need. It takes about a minute.' },
    { title: 'Shape the design', desc: 'Work through our Home Design Tool at your own pace to capture what you want.' },
    { title: 'Talk it through', desc: 'Book a free consultation with a team member who already knows your project.' },
    { title: 'Build & track progress', desc: 'Follow progress from first site work to handover in your customer portal.' },
  ],
  costHeading: 'What affects the cost and timeline of an extension?',
  costIntro: 'There is no single price for an extension, because every block and every house is different. The main factors are:',
  costFactors: [
    'How much floor area you are adding, and whether it is single or multi-level',
    'Site conditions, including soil, slope, access and existing structures',
    'How the new area connects to the existing house',
    'Design complexity and the finishes and fittings you choose',
    'Approvals your project requires, such as building and, where relevant, planning permits',
    'Any updates needed to the existing home so the old and new work together',
  ],
  faqsHeading: 'Extension questions homeowners ask us',
  faqs: [
    {
      q: 'Do I need a permit to extend my house in Victoria?',
      a: 'Extensions almost always need a building permit, and depending on your property, setbacks and any overlays, may also need a planning permit. We will explain which approvals apply to your project as part of planning it.',
    },
    {
      q: 'How long does a home extension take?',
      a: 'Design and approvals come before construction, and the build itself depends on the size and complexity of the extension. We will give you an expected timeline once we understand your project.',
    },
    {
      q: 'Can we live in the house while the extension is built?',
      a: 'Often, yes. Much of the work happens outside or separately from the existing rooms, though there will be disruption, especially where the new space connects to the old. We will talk through what to expect.',
    },
    {
      q: 'Do I need plans drawn before I contact a builder?',
      a: 'No. You can start by registering your project and working through our Home Design Tool, which helps us understand what you want before we talk.',
    },
    {
      q: 'How do I know what an extension will cost?',
      a: 'We quote from your specific scope. Our guide on extension costs and timelines explains what drives the price, and a free consultation is the quickest way to get numbers that fit your home.',
    },
    {
      q: 'Which areas do you build extensions in?',
      a: 'We work across Melbourne’s Eastern Suburbs, including Ringwood, Croydon, Boronia, Blackburn, Glen Waverley, Mitcham and Rowville. If you are nearby, register your project with your address and we will confirm we can help.',
    },
  ],
  related: [
    { href: '/renovation', label: 'Home renovations' },
    { href: '/new-home', label: 'New home builds' },
    { href: '/blog/extension-costs-timelines-guide', label: 'Extension costs & timelines: a practical guide' },
    { href: '/blog/design-build-vs-hiring-separately', label: 'Design & build vs hiring separately' },
  ],
}

export const NEW_HOME = {
  path: '/new-home',
  serviceName: 'New home building',
  serviceType: 'New home construction',
  heading: 'New home builds in Melbourne’s Eastern Suburbs',
  intro: [
    'Building a new home is a big decision, and it goes better when you have a builder who explains each stage clearly. EBC is a registered Melbourne builder that builds custom homes on vacant blocks and knockdown-rebuild sites.',
    'From the first conversation through to handover, we keep the process organised and transparent, so you know what is happening and what comes next.',
  ],
  servicesHeading: 'What we build',
  services: [
    { title: 'Knockdown & rebuild', desc: 'Replace an ageing home with a new one, on the street and in the suburb you already love.' },
    { title: 'Homes on vacant blocks', desc: 'A custom home designed around your block, your budget and the way you live.' },
    { title: 'Fixed-price quotes', desc: 'A clear quote based on your plans, so you know what is included before you commit.' },
    { title: 'One team, start to finish', desc: 'The same builder responsible from the first meeting through to the final handover.' },
  ],
  stepsHeading: 'How building a new home works with EBC',
  steps: [
    { title: 'Register your project', desc: 'Tell us about your block and what you want to build. It takes about a minute.' },
    { title: 'Shape the design', desc: 'Work through our Home Design Tool at your own pace so we understand your brief.' },
    { title: 'Talk it through', desc: 'Book a free consultation with a team member who already knows your project.' },
    { title: 'Build & track progress', desc: 'Follow progress from first site work to handover in your customer portal.' },
  ],
  costHeading: 'What affects the cost of a new home?',
  costIntro: 'We price from your plans and specification. The main things that shape the total are:',
  costFactors: [
    'The size and layout of the home, and the number of storeys',
    'Site conditions such as slope, soil, access and services connections',
    'Demolition and site preparation if you are rebuilding',
    'Design complexity, and the standard of finishes and fittings',
    'Energy-efficiency and sustainability features you choose',
    'Council and other approvals your site requires',
  ],
  faqsHeading: 'New home questions homeowners ask us',
  faqs: [
    {
      q: 'What is a knockdown rebuild?',
      a: 'It means demolishing an existing home and building a new one on the same block. It lets you stay in a location you like while getting a home designed for how you live now.',
    },
    {
      q: 'Can you build on a vacant block?',
      a: 'Yes. Tell us about the block when you register your project and we will talk through what is involved.',
    },
    {
      q: 'Do I need plans before I contact you?',
      a: 'No. You can start by registering your project and using our Home Design Tool, which helps us understand what you want before we speak.',
    },
    {
      q: 'Will I get a fixed-price quote?',
      a: 'We provide clear quotes based on your plans and specification, so you can see what is included before committing. Register your project and we will walk you through the next steps.',
    },
    {
      q: 'What insurance and warranty apply to a new home in Victoria?',
      a: 'Victorian law generally requires builders to provide domestic building insurance for major residential work, and the rules in this area are changing. We will explain exactly what applies to your build during your consultation.',
    },
    {
      q: 'Which areas do you build in?',
      a: 'We work across Melbourne’s Eastern Suburbs, including Ringwood, Croydon, Boronia, Blackburn, Glen Waverley, Mitcham and Rowville. If you are nearby, register your project with your address and we will confirm we can help.',
    },
  ],
  related: [
    { href: '/renovation', label: 'Home renovations' },
    { href: '/extension', label: 'Home extensions' },
    { href: '/blog/design-build-vs-hiring-separately', label: 'Design & build vs hiring separately' },
    { href: '/blog', label: 'All building advice' },
  ],
}
