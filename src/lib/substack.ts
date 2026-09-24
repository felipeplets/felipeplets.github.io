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
 * Substack sits behind Cloudflare, which is markedly more suspicious of
 * datacenter IPs such as GitHub Actions runners than of residential ones. A
 * default Node user-agent gets a 403 from CI even though the same request
 * succeeds from a laptop, so present as a normal browser and retry briefly.
 */
const FEED_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  accept:
    'application/rss+xml, application/xml;q=0.9, application/json;q=0.8, text/html;q=0.7, */*;q=0.5',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
} as const;

async function fetchFeed(url: string, attempts = 3): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: FEED_HEADERS,
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        throw new Error(`${url} responded with ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function fromRss(xml: string, limit: number): SubstackPost[] {
  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.slice(0, limit).map((item: Record<string, unknown>): SubstackPost => {
    const description = stripHtml(text(item.description));
    const enclosure = item.enclosure as { '@_url'?: string; '@_type'?: string } | undefined;
    const enclosureUrl =
      enclosure?.['@_type']?.startsWith('image/') ||
      /\.(png|jpe?g|webp|gif)/i.test(enclosure?.['@_url'] ?? '')
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
}

interface ArchiveEntry {
  title?: string;
  canonical_url?: string;
  post_date?: string;
  description?: string;
  cover_image?: string;
}

/** Substack's own archive endpoint, used as a second chance when RSS is blocked. */
function fromArchive(json: string, limit: number): SubstackPost[] {
  const entries = JSON.parse(json) as ArchiveEntry[];
  if (!Array.isArray(entries)) return [];

  return entries
    .filter((entry) => entry.canonical_url && entry.title)
    .slice(0, limit)
    .map((entry) => ({
      title: stripHtml(entry.title ?? ''),
      url: entry.canonical_url ?? '',
      date: new Date(entry.post_date ?? ''),
      excerpt: truncate(stripHtml(entry.description ?? '')),
      image: entry.cover_image,
    }));
}

/**
 * Fetches the Substack feed at build time.
 *
 * Runs during `astro build`, so the published HTML is fully static. A scheduled
 * GitHub Actions rebuild keeps the list current. If every source is unreachable
 * the build still succeeds and the newsletter section falls back to a plain CTA.
 */
export async function getSubstackPosts(limit = 4): Promise<SubstackPost[]> {
  const archiveUrl = `${SUBSTACK.url.replace(/\/$/, '')}/api/v1/archive?sort=new&limit=${limit}`;

  const sources: Array<{ name: string; load: () => Promise<SubstackPost[]> }> = [
    { name: 'rss', load: async () => fromRss(await fetchFeed(SUBSTACK.feed), limit) },
    { name: 'archive', load: async () => fromArchive(await fetchFeed(archiveUrl), limit) },
  ];

  const failures: string[] = [];

  for (const source of sources) {
    try {
      const posts = await source.load();
      if (posts.length > 0) return posts;
      failures.push(`${source.name} returned no posts`);
    } catch (error) {
      failures.push(`${source.name}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.warn(
    `[substack] Could not load the newsletter feed, rendering the CTA without posts. ${failures.join('; ')}`
  );
  return [];
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
