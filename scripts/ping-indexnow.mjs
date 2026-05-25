// Pushes all sitemap URLs to IndexNow (Bing + Yandex + Naver + Seznam + DuckDuckGo).
// Runs from CI after deploy succeeds — fetches the live sitemap so we hit the
// freshly-published URL set without needing a CI artifact handoff.

const KEY = '65cc23ce4986414a9cd789a40c9fc810';
const HOST = 'gabrielvargas94.github.io';
const SITE = `https://${HOST}`;
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP_URL = `${SITE}/sitemap-0.xml`;

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`sitemap fetch ${res.status}: ${SITEMAP_URL}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const urls = await fetchSitemapUrls();
  if (urls.length === 0) {
    console.error('[indexnow] no URLs found in sitemap — aborting');
    process.exit(1);
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  // 200/202 = accepted. 422 = key file not reachable yet (CDN warmup).
  // Non-2xx is logged but never fails the job — site is already deployed.
  console.log(`[indexnow] ${res.status} ${res.statusText} — submitted ${urls.length} URLs`);
  if (!res.ok) {
    const body = await res.text();
    console.warn(`[indexnow] response body: ${body.slice(0, 500)}`);
  }
}

main().catch((err) => {
  console.error('[indexnow] failed:', err);
  process.exit(0);
});
