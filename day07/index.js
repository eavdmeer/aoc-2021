import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day07');

if (process.argv[2])
{
  day07(process.argv[2]).then(console.log);
}

function solve1(data)
{
  const range = { min: Math.min(...data), max: Math.max(...data) };

  const scores = {};
  for (let p = range.min; p <= range.max; p++)
  {
    scores[p] = data.reduce((a, v) => a + Math.abs(v - p), 0);
  }
  const minFuel = Math.min(...Object.values(scores));
  const best = Object.entries(scores).find(([ , v ]) => v === minFuel);

  return best[1];
}

function solve2(data)
{
  const range = { min: Math.min(...data), max: Math.max(...data) };
  const consumption = [];
  let cost = 0;
  let last = 0;
  for (let steps = 0; steps < 1 + range.max - range.min; steps++)
  {
    last += cost++;
    consumption.push(last);
  }

  const scores = {};
  for (let p = range.min; p <= range.max; p++)
  {
    scores[p] = data.reduce((a, v) => a + consumption[Math.abs(v - p)], 0);
  }
  const minFuel = Math.min(...Object.values(scores));

  const best = Object.entries(scores).find(([ , v ]) => v === minFuel);

  return best[1];
}

export default async function day07(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*,\s*/)
    .filter(v => v)
    .map(v => parseInt(v, 10));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 37)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 37`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 168)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 168`);
  }

  return { day: 7, part1, part2, duration: Date.now() - start };
}
