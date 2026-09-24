export const SITE = {
  name: 'Felipe Plets',
  url: 'https://felipeplets.com',
  title: 'Felipe Plets — Engineering leadership for the agentic era',
  tagline: 'Engineering leadership for the agentic era',
  description:
    'Felipe Plets is an engineering leader in Toronto writing about AI-native teams, agentic engineering, and designing practices so software quality does not drift as velocity increases.',
  locale: 'en',
  author: 'Felipe Plets',
} as const;

export const SUBSTACK = {
  name: 'All You Can Lead',
  url: 'https://allyoucanlead.substack.com',
  feed: 'https://allyoucanlead.substack.com/feed',
  description:
    'Leadership, technology, and personal growth — written from the lens of a hands-on engineering leader.',
} as const;

export const SOCIALS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/felipeplets', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/felipeplets', icon: 'github' },
  { name: 'Substack', url: SUBSTACK.url, icon: 'substack' },
] as const;

export const NAV = [
  { label: 'About', href: '/#about' },
  { label: 'Practice', href: '/#practice' },
  { label: 'Writing', href: '/#writing' },
  { label: 'Speaking', href: '/speaking' },
  { label: 'Contact', href: '/#contact' },
] as const;

/**
 * Public contact address. Left null until a real mailbox exists — set it to a
 * string to add an email channel to the contact section and speaking CTA.
 */
export const CONTACT_EMAIL: string | null = null;
