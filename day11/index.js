import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day11');

if (process.argv[2])
{
  day11(process.argv[2]).then(console.log);
}

function solve1(data)
{
  const steps = 100;
  const w = data[0].length;
  const h = data.length;
  let flashes = 0;

  for (let i = 0; i < steps; i++)
  {
    const flashPoints = [];

    // Increment each cell by 1
    data.forEach((row, y) => data[y] = row.map(v => v + 1));

    while (data.some(row => row.some(c => c > 9)))
    {
      data.forEach((row, y) =>
      {
        row.forEach((col, x) =>
        {
          if (col < 10) { return; }

          // Only flash once per step
          if (flashPoints.every(p => p.x !== x || p.y !== y))
          {
            // Need to 'flash'
            flashPoints.push({ x: x, y: y });

            // Increment all adjecent cells, also diagonally
            const increment = [
              { y: y - 1, x: x - 1 },
              { y: y - 1, x: x },
              { y: y - 1, x: x + 1 },
              { y: y, x: x - 1 },
              { y: y, x: x + 1 },
              { y: y + 1, x: x - 1 },
              { y: y + 1, x: x },
              { y: y + 1, x: x + 1 }
            ];
            increment.forEach(p =>
            {
              if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h)
              {
                data[p.y][p.x]++;
              }
            });
          }
        });
        data[y] = row;
      });

      // Reset value for all points that flashed to 0
      flashPoints.forEach(p => data[p.y][p.x] = 0);
    }

    flashes += flashPoints.length;
  }

  return flashes;
}

function solve2(content)
{
  const data = content
    .toString()
    .trim()
    .split(/\n/)
    .map(v => v.split('').map(i => parseInt(i, 10)));

  let steps = 0;
  const maxSteps = 100000;
  const w = data[0].length;
  const h = data.length;
  const flashPoints = [];

  do
  {
    // Reset flash points array
    flashPoints.length = 0;

    // Increment each cell by 1
    data.forEach((row, y) => data[y] = row.map(v => v + 1));

    while (data.some(row => row.some(c => c > 9)))
    {
      data.forEach((row, y) =>
      {
        row.forEach((col, x) =>
        {
          if (col < 10) { return; }

          // Only flash once per step
          if (flashPoints.every(p => p.x !== x || p.y !== y))
          {
            // Need to 'flash'
            flashPoints.push({ x: x, y: y });

            // Increment all adjecent cells, also diagonally
            const increment = [
              { y: y - 1, x: x - 1 },
              { y: y - 1, x: x },
              { y: y - 1, x: x + 1 },
              { y: y, x: x - 1 },
              { y: y, x: x + 1 },
              { y: y + 1, x: x - 1 },
              { y: y + 1, x: x },
              { y: y + 1, x: x + 1 }
            ];
            increment.forEach(p =>
            {
              if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h)
              {
                data[p.y][p.x]++;
              }
            });
          }
        });
        data[y] = row;
      });

      // Reset value for all points that flashed to 0
      flashPoints.forEach(p => data[p.y][p.x] = 0);
    }

    steps++;
  } while (steps < maxSteps && flashPoints.length !== w * h);

  return steps;
}


export default async function day11(target)
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
  if (target.includes('example') && part1 !== 1656)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 1656`);
  }

  const part2 = solve2(buffer);
  if (target.includes('example') && part2 !== 195 && part2 !== 'todo')
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 195`);
  }

  return { day: 11, part1, part2, duration: Date.now() - start };
}
