import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('dayxx');

if (process.argv[2])
{
  dayxx(process.argv[2]).then(console.log);
}

function step1(template, map)
{
  // Break down the template into pairs
  const pairs = template
    .split('')
    .map((v, i, o) => `${v}${o[i + 1]}`);

  return pairs.map(p => map[p] ? `${p[0]}${map[p]}` : p[0]).join('');
}

function solve1(data)
{
  const template = data[0];
  const rules = data
    .filter(v => /^[A-Z]+\s*->\s*[A-Z]+$/.test(v))
    .map(v => v.split(/\s*->\s*/))
    .map(v => ({ from: v[0], to: v[1] }));

  const map = {};
  rules.forEach(v => map[v.from] = v.to);

  let polymer = template;
  for (let t = 0; t < 10; t++)
  {
    polymer = step1(polymer, map);
  }

  const uniq = polymer
    .split('')
    .filter((v, i, o) => o.indexOf(v) !== i);
  uniq.sort();

  const counts = {};
  uniq.forEach(f => counts[f] = 0);
  polymer
    .split('')
    .forEach(c => counts[c]++);

  const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);

  return sorted.pop()[1] - sorted.shift()[1];
}

function adjustCount(obj, key, count)
{
  obj[key] = obj[key] ? obj[key] + count : count;
}

function splitPairs(template)
{
  // Break down the template into pairs
  const pairs = template
    .split('')
    .map((v, i, o) => `${v}${o[i + 1]}`);
  pairs.pop();

  const result = {};
  pairs.forEach(v => adjustCount(result, v, 1));

  return result;
}

function step2(template, map, n)
{
  const pairs = splitPairs(template);

  for (let i = 0; i < n; i++)
  {
    const newPairs = {};
    Object.entries(pairs).forEach(([ pair, count ]) =>
    {
      if (count === 0) { return; }
      pairs[pair] -= count;
      adjustCount(newPairs, `${pair[0]}${map[pair]}`, count);
      adjustCount(newPairs, `${map[pair]}${pair[1]}`, count);
    });
    Object.entries(newPairs).forEach(([ pair, count ]) =>
    {
      adjustCount(pairs, pair, count);
    });
  }

  // Count the first letter of each pair
  const counts = {};
  Object.entries(pairs).forEach(([ pair, count ]) =>
  {
    adjustCount(counts, pair[0], count);
  });
  // Make sure the last letter is counted
  adjustCount(counts, template[template.length - 1], 1);

  return Math.max(...Object.values(counts)) -
    Math.min(...Object.values(counts));
}

function solve2(data)
{
  const template = data[0];
  const rules = data
    .filter(v => /^[A-Z]+\s*->\s*[A-Z]+$/.test(v))
    .map(v => v.split(/\s*->\s*/))
    .map(v => ({ from: v[0], to: v[1] }));

  const map = {};
  rules.forEach(v => map[v.from] = v.to);

  const answer = step2(template, map, 40);

  return answer;
}

export default async function dayxx(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 1588)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 1588`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 2188189693529)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 2188189693529`);
  }

  return { day: -1, part1, part2, duration: Date.now() - start };
}
