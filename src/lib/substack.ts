import cache from '../content/substack-cache.json';

export interface SubstackPost {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  image?: string;
}

interface CachedPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
}

/**
 * Returns the latest newsletter posts from the committed feed snapshot.
 *
 * The snapshot is refreshed by `scripts/refresh-feed.mjs`, which runs as part
 * of `npm run build`. Fetching here instead would reintroduce the production
 * bug it was written to fix: Cloudflare answers 403 to GitHub Actions runners,
 * so CI builds silently shipped without any posts. Reading a committed file
 * also keeps builds deterministic and offline-capable.
 */
export function getSubstackPosts(limit = 4): SubstackPost[] {
  return (cache as CachedPost[]).slice(0, limit).map((post) => ({
    ...post,
    date: new Date(post.date),
  }));
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
