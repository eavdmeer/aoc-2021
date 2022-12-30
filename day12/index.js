import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day12');

if (process.argv[2])
{
  day12(process.argv[2]).then(console.log);
}

function walk1(routes, destinations, route, loc)
{
  // Avoid visiting the same lower case node more than once
  const duplicate = /^[a-z]+$/.test(loc) && route.some(v => v === loc);
  route.push(loc);
  if (duplicate) { return; }

  // Detect complete rout
  if (loc === 'end')
  {
    routes.push(Array.from(route));
    return;
  }

  // Try all paths from here
  destinations[loc].forEach(d =>
  {
    walk1(routes, destinations, route, d);
    route.pop();
  });
}

function walk2(routes, destinations, route, loc)
{
  route.push(loc);

  // find lowercase node visit counts with more than 1 visit
  const counts = route
    .filter(v => /^[a-z]+$/.test(v))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(v => route.filter(c => c === v).length)
    .filter(v => v > 1);

  // We allow 1 node to be visited more than once, but no more than twice
  if (counts.length > 1 || counts.some(v => v > 2))
  {
    return;
  }

  // Detect complete route
  if (loc === 'end')
  {
    routes.push(Array.from(route));
    return;
  }

  // Try all paths from here
  destinations[loc].forEach(d =>
  {
    walk2(routes, destinations, route, d);
    route.pop();
  });
}

function solve1(data)
{
  // map all destinations form each node
  const destinations = {};
  data.forEach(([ from, to ]) =>
  {
    destinations[from] = destinations[from] ? destinations[from] : [];
    destinations[from].push(to);
  });
  data.forEach(([ to, from ]) =>
  {
    if (to === 'start' || from === 'end') { return; }
    destinations[from] = destinations[from] ? destinations[from] : [];
    destinations[from].push(to);
  });

  const routes = [];
  const route = [];
  walk1(routes, destinations, route, 'start');

  return routes.length;
}

function solve2(data)
{
  // map all destinations form each node
  const destinations = {};
  data.forEach(([ from, to ]) =>
  {
    destinations[from] = destinations[from] ? destinations[from] : [];
    destinations[from].push(to);
  });
  data.forEach(([ to, from ]) =>
  {
    if (to === 'start' || from === 'end') { return; }
    destinations[from] = destinations[from] ? destinations[from] : [];
    destinations[from].push(to);
  });

  const routes = [];
  const route = [];
  walk2(routes, destinations, route, 'start');

  return routes.length;
}

export default async function day12(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split('-'));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 10)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 10`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 36 ||
      target.includes('medium') && part2 !== 103 ||
      target.includes('big') && part2 !== 3509)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 36`);
  }

  return { day: 12, part1, part2, duration: Date.now() - start };
}
