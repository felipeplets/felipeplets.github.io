import { XMLParser } from 'fast-xml-parser';
import { SUBSTACK } from '../consts';

export interface SubstackPost {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  image?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
});

/** Unwraps values that fast-xml-parser may return as CDATA objects. */
function text(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && '__cdata' in value) {
    return String((value as { __cdata: unknown }).__cdata ?? '');
  }
  return '';
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;|&rsquo;/g, '\u2019')
    .replace(/&#8216;|&lsquo;/g, '\u2018')
    .replace(/&#8220;|&ldquo;/g, '\u201c')
    .replace(/&#8221;|&rdquo;/g, '\u201d')
    .replace(/&#8230;|&hellip;/g, '\u2026')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value: string, max = 180): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).replace(/[\s,;:.\-\u2013\u2014]+\S*$/, '')}\u2026`;
}

/**
 * Fetches the Substack RSS feed at build time.
 *
 * Runs during `astro build`, so the published HTML is fully static. A scheduled
 * GitHub Actions rebuild keeps the list current. If the feed is unreachable the
 * build still succeeds and the newsletter section falls back to a plain CTA.
 */
export async function getSubstackPosts(limit = 4): Promise<SubstackPost[]> {
  try {
    const response = await fetch(SUBSTACK.feed, {
      headers: { 'user-agent': 'felipeplets.com build (+https://felipeplets.com)' },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`Substack feed responded with ${response.status}`);
    }

    const parsed = parser.parse(await response.text());
    const rawItems = parsed?.rss?.channel?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    return items.slice(0, limit).map((item: Record<string, unknown>): SubstackPost => {
      const description = stripHtml(text(item.description));
      const enclosure = item.enclosure as { '@_url'?: string; '@_type'?: string } | undefined;
      const enclosureUrl =
        enclosure?.['@_type']?.startsWith('image/') || /\.(png|jpe?g|webp|gif)/i.test(enclosure?.['@_url'] ?? '')
          ? enclosure?.['@_url']
          : undefined;

      return {
        title: stripHtml(text(item.title)),
        url: text(item.link),
        date: new Date(text(item.pubDate)),
        excerpt: truncate(description),
        image: enclosureUrl,
      };
    });
  } catch (error) {
    console.warn(
      `[substack] Could not load the newsletter feed, rendering the CTA without posts. ${
        error instanceof Error ? error.message : error
      }`
    );
    return [];
  }
}

export function formatDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
