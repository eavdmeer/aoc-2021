import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day05');

if (process.argv[2])
{
  day05(process.argv[2]).then(console.log);
}

/*
function draw(map)
{
  const xvals = Object.keys(map)
    .map(k => parseInt(k.replace(/^(\d+)-\d+$/, '$1'), 10));
  const yvals = Object.keys(map)
    .map(k => parseInt(k.replace(/^\d+-(\d+)$/, '$1'), 10));
  const xrange = {
    min: Math.min(...xvals),
    max: Math.max(...xvals)
  };
  const yrange = {
    min: Math.min(...yvals),
    max: Math.max(...yvals)
  };

  for (let y = yrange.min; y <= yrange.max; y++)
  {
    let line = '';
    for (let x = xrange.min; x <= xrange.max; x++)
    {
      line += map[`${x}-${y}`] || '.';
    }
    console.log(line);
  }
}
*/

function walk(map, path)
{
  // console.log('path:', path);

  const xrange = {
    min: Math.min(path[0], path[2]),
    max: Math.max(path[0], path[2])
  };
  const yrange = {
    min: Math.min(path[1], path[3]),
    max: Math.max(path[1], path[3])
  };

  // If not verticle, the line is:
  //
  //   y = a * x + b
  //
  // where:
  //
  //   path[1] = a * path[0] + b
  //   path[3] = a * path[2] + b
  //
  // so:
  //
  //   b = path[1] - a * path[0]
  //   b = path[3] - a * path[2]
  //
  //   path[1] - a * path[0] = path[3] - a * path[2]
  //   path[1] - path[3] = a * (path[0] - path[2])
  //
  //   a = (path[1] - path[3]) / (path[0] - path[2])

  if (path[0] !== path[2])
  {
    const a = (path[1] - path[3]) / (path[0] - path[2]);
    const b = path[1] - a * path[0];
    // console.log(`line: y = ${a} * x + ${b}`);
    for (let x = xrange.min; x <= xrange.max; x++)
    {
      const y = a * x + b;
      // console.log(`walking ${x}, ${y}`);
      const key = `${x}-${y}`;
      map[key] = (map[key] || 0) + 1;
    }
  }
  else
  {
    const x = path[0];
    for (let y = yrange.min; y <= yrange.max; y++)
    {
      // console.log(`walking ${x}, ${y}`);
      const key = `${x}-${y}`;
      map[key] = (map[key] || 0) + 1;
    }
  }
}

function solve1(data, allowDiagonal = false)
{
  // Walk over the map on the lines, but only horizontal and vertical ones
  const map = {};

  const paths = allowDiagonal ? data :
    data.filter(v => v[0] === v[2] || v[1] === v[3]);

  paths.forEach(path => walk(map, path));

  return Object.values(map).filter(v => v > 1).length;
}

function solve2(data)
{
  return solve1(data, true);
}

export default async function day05(target)
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
    .map(v => v
      .trim()
      .split(/\s*,\s*|\s*->\s*/)
      .map(v => parseInt(v, 10)));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 5)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 5`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 12)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 12`);
  }

  return { day: 5, part1, part2, duration: Date.now() - start };
}
