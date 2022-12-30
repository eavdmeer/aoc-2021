import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day09');

if (process.argv[2])
{
  day09(process.argv[2]).then(console.log);
}

function basin(map, x, y)
{
  const data = Array.from(map);
  const width = map[0].length;
  const height = map.length;

  // mark coordinate as visited
  data[y][x] = 9;

  let result = 1;

  if (x - 1 >= 0 && data[y][x - 1] < 9)
  {
    result += basin(data, x - 1, y);
  }
  if (x + 1 < width && data[y][x + 1] < 9)
  {
    result += basin(data, x + 1, y);
  }
  if (y - 1 >= 0 && data[y - 1][x] < 9)
  {
    result += basin(data, x, y - 1);
  }
  if (y + 1 < height && data[y + 1][x] < 9)
  {
    result += basin(data, x, y + 1);
  }

  return result;
}

function solve1(data)
{
  const width = data[0].length;
  const height = data.length;

  const lowPoints = [];

  for (let y = 0; y < data.length; y++)
  {
    for(let x = 0; x < data[0].length; x++)
    {
      const h = data[y][x];
      if (
        (x - 1 < 0 || data[y][x - 1] > h) &&
          (x + 1 >= width || data[y][x + 1] > h) &&
          (y - 1 < 0 || data[y - 1][x] > h) &&
          (y + 1 >= height || data[y + 1][x] > h)
      )
      {
        lowPoints.push({ y: y, x: x, h: h });
      }
    }
  }

  return lowPoints.reduce((a, v) => a + 1 + v.h, 0);
}

function solve2(data)
{
  const width = data[0].length;
  const height = data.length;

  const lowPoints = [];

  for (let y = 0; y < data.length; y++)
  {
    for(let x = 0; x < data[0].length; x++)
    {
      const h = data[y][x];
      if (
        (x - 1 < 0 || data[y][x - 1] > h) &&
          (x + 1 >= width || data[y][x + 1] > h) &&
          (y - 1 < 0 || data[y - 1][x] > h) &&
          (y + 1 >= height || data[y + 1][x] > h)
      )
      {
        lowPoints.push({ y: y, x: x, h: h });
      }
    }
  }

  const basins = lowPoints
    .map(v => basin(data, v.x, v.y))
    .sort((a, b) => b - a);


  return basins.slice(0, 3).reduce((a, v) => a * v, 1);
}

export default async function day09(target)
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
    .map(v => v.split('').map(i => parseInt(i, 10)));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 15)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 15`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 1134)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 1134`);
  }

  return { day: 9, part1, part2, duration: Date.now() - start };
}
