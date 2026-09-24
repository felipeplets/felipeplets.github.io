/**
 * Refreshes the committed snapshot of the Substack feed.
 *
 * Substack sits behind Cloudflare, which refuses requests from GitHub Actions
 * runners (both the RSS feed and the archive endpoint answer 403 there, while
 * the identical request succeeds from a laptop). Fetching during the CI build
 * therefore silently dropped the essays list from production.
 *
 * So the feed is fetched here instead and committed to src/content. The build
 * only reads that file, which also makes builds deterministic and offline.
 * This runs as part of `npm run build`, so a local build always refreshes it;
 * in CI it fails, warns, and leaves the committed snapshot in place.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://allyoucanlead.substack.com/feed';
const ARCHIVE_URL = 'https://allyoucanlead.substack.com/api/v1/archive?sort=new&limit=4';
const LIMIT = 4;

const cachePath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'content',
  'substack-cache.json',
);

const HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  accept:
    'application/rss+xml, application/xml;q=0.9, application/json;q=0.8, text/html;q=0.7, */*;q=0.5',
  'accept-language': 'en-US,en;q=0.9',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
});

function text(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && '__cdata' in value) {
    return String(value.__cdata ?? '');
  }
  return '';
}

function stripHtml(html) {
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

function truncate(value, max = 180) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).replace(/[\s,;:.\-\u2013\u2014]+\S*$/, '')}\u2026`;
}

async function get(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: HEADERS,
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`${url} responded with ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
      }
    }
  }
  throw lastError;
}

function fromRss(xml) {
  const raw = parser.parse(xml)?.rss?.channel?.item;
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return items.slice(0, LIMIT).map((item) => {
    const enclosure = item.enclosure;
    const url = enclosure?.['@_url'];
    const isImage =
      enclosure?.['@_type']?.startsWith('image/') || /\.(png|jpe?g|webp|gif)/i.test(url ?? '');

    return {
      title: stripHtml(text(item.title)),
      url: text(item.link),
      date: new Date(text(item.pubDate)).toISOString(),
      excerpt: truncate(stripHtml(text(item.description))),
      image: isImage ? url : undefined,
    };
  });
}

function fromArchive(json) {
  const entries = JSON.parse(json);
  if (!Array.isArray(entries)) return [];

  return entries
    .filter((entry) => entry.canonical_url && entry.title)
    .slice(0, LIMIT)
    .map((entry) => ({
      title: stripHtml(entry.title),
      url: entry.canonical_url,
      date: new Date(entry.post_date).toISOString(),
      excerpt: truncate(stripHtml(entry.description ?? '')),
      image: entry.cover_image ?? undefined,
    }));
}

const sources = [
  { name: 'rss', load: async () => fromRss(await get(FEED_URL)) },
  { name: 'archive', load: async () => fromArchive(await get(ARCHIVE_URL)) },
];

const failures = [];

for (const source of sources) {
  try {
    const posts = await source.load();
    if (posts.length === 0) {
      failures.push(`${source.name} returned no posts`);
      continue;
    }

    await writeFile(cachePath, `${JSON.stringify(posts, null, 2)}\n`);
    console.log(`[feed] Refreshed ${posts.length} posts from ${source.name}.`);
    process.exit(0);
  } catch (error) {
    failures.push(`${source.name}: ${error instanceof Error ? error.message : error}`);
  }
}

console.warn(
  `[feed] Could not refresh the feed, keeping the committed snapshot. ${failures.join('; ')}`,
);
