import * as fs from 'fs/promises';
import makeDebug from 'debug';
import LanternFish from './lanternfish.js';

const debug = makeDebug('day06');

if (process.argv[2])
{
  day06(process.argv[2]).then(console.log);
}

function findDistribution(data)
{
  const distribution = {};
  data.forEach(v => distribution[v] = distribution[v] ?
    distribution[v] + 1 : 1);

  return distribution;
}

function populationAfterDays(distribution, days)
{
  // Calculate end population for each timer value afther the days
  const population = {};
  Object.entries(distribution).forEach(([ v, base ]) =>
  {
    // All the fish
    const ocean = [];
    ocean.push(v);
    for (let t = 0; t < days; t++)
    {
      ocean.forEach((timer, i) =>
      {
        ocean[i]--;
        if (ocean[i] < 0)
        {
          ocean[i] = 6;
          ocean.push(8);
        }
      });
    }
    const nextgen = findDistribution(ocean);

    Object.keys(nextgen).forEach(k => population[k] =
      (population[k] || 0) + base * nextgen[k]);
  });

  return population;
}

function solve1(data, days = 80)
{
  // All the fish
  const ocean = [];

  // Put all Lanternfish in the ocean
  data.forEach(v => ocean.push(new LanternFish(v)));

  for (let t = 0; t < days; t++)
  {
    ocean.forEach(v =>
    {
      const child = v.liveOneDay();
      if (child)
      {
        ocean.push(child);
      }
    });
  }

  return ocean.length;
}

function solve2(data, days = 256)
{
  // Find unique timer values and poplation count for all fish
  let population = findDistribution(data);

  const blockSize = 50;
  for (let loop = 0; loop < Math.floor(days / blockSize); loop++)
  {
    population = populationAfterDays(population, blockSize);
  }
  if (days % blockSize)
  {
    population = populationAfterDays(population, days % blockSize);
  }

  // Calculate the sum for all fish
  const total = Object.values(population)
    .reduce((a, v) => a + v);


  return total;
}

export default async function day06(target)
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
  if (target.includes('example') && part1 !== 5934)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 5934`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 26984457539)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 26984457539`);
  }

  return { day: 6, part1, part2, duration: Date.now() - start };
}
