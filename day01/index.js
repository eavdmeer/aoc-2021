import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day01');

if (process.argv[2])
{
  day01(process.argv[2]).then(console.log);
}

function countIncreases(data)
{
  return data
    .map((v, i, a) => i > 0 ? v > a[i - 1] ? 1 : 0 : 0)
    .reduce((a, v) => a + v, 0);
}

function window(data, size)
{
  const result = [];

  for (let idx = 0; idx <= data.length - size; idx++)
  {
    result.push(data.slice(idx, idx + size).reduce((a, v) => a + v, 0));
  }
  return result;

  /*
  return data
    .map((v, i, d) => d.slice(i, i + size))
    .filter(v => v.size < size)
    .map(v => v.reduce((a, v) => a + v, 0));
  */
}

function solve1(data)
{
  return countIncreases(data);
}

function solve2(data)
{
  return countIncreases(window(data, 3));
}

export default async function day01(target)
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
    .map(v => parseInt(v, 10));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 7)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 7`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 5)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 5`);
  }

  return { day: 1, part1, part2, duration: Date.now() - start };
}
