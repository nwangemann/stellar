import { existsSync, readdirSync, readFileSync } from 'node:fs';

const problems = [];
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const used = new Set([...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]);
const rows = readFileSync('docs/dependencies.md', 'utf8').matchAll(/^\| `([^`]+)`/gm);
const listed = new Set([...rows].map((m) => m[1]));
for (const n of used)
  if (!listed.has(n)) problems.push(`${n} is missing from docs/dependencies.md`);
for (const n of listed) if (!used.has(n)) problems.push(`${n} is documented but not installed`);
for (const d of readdirSync('src/features', { withFileTypes: true })) {
  if (d.isDirectory() && !existsSync(`docs/systems/${d.name}.md`))
    problems.push(`src/features/${d.name} has no docs/systems/${d.name}.md`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('docs:check passed');
