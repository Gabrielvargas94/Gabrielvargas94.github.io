// Extracts and pretty-prints JSON-LD blocks from the live home page.
const url = process.argv[2] ?? 'https://gabrielvargas94.github.io/';
const html = await fetch(url).then((r) => r.text());
const re = /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/g;
const matches = [...html.matchAll(re)];
console.log(`Found ${matches.length} JSON-LD block(s) at ${url}`);
for (const [i, m] of matches.entries()) {
  try {
    const data = JSON.parse(m[1]);
    console.log(`\n--- Block ${i + 1} ---`);
    if (Array.isArray(data['@graph'])) {
      console.log('Types:', data['@graph'].map((n) => n['@type']).join(', '));
      const person = data['@graph'].find((n) => n['@type'] === 'Person');
      if (person) {
        console.log('Person.name:', person.name);
        console.log('Person.jobTitle:', person.jobTitle);
        console.log('Person.url:', person.url);
        console.log('Person.worksFor count:', Array.isArray(person.worksFor) ? person.worksFor.length : 'not-array');
        console.log('Person.sameAs:', person.sameAs);
        console.log('Person.knowsLanguage:', person.knowsLanguage?.map((l) => l.name));
      }
    } else if (data['@type'] === 'FAQPage') {
      console.log('FAQ Q count:', data.mainEntity?.length);
      console.log('First Q:', data.mainEntity?.[0]?.name);
    } else {
      console.log('Type:', data['@type']);
    }
  } catch (e) {
    console.log(`Block ${i + 1} parse error:`, e.message);
  }
}
