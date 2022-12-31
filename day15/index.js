import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day15');

if (process.argv[2])
{
  day15(process.argv[2]).then(console.log);
}

// Optimistic estimate of the total risk from (x,y) to the bottom right,
// assuming all remaining risk values are 1 and starting at current cost
function estimate(data, x, y, cost, r = 1)
{
  return cost + r * data.width - 1 - x + r * data.height - y - 1;
}

function riskLevel(data, x, y)
{
  const r = data[y % data.height][x % data.width];
  const b = Math.floor(x / data.width) + Math.floor(y / data.height);

  // risk level of (x,y)
  return Math.floor((r + b) / 10) + (r + b) % 10;
}

function getNeighbors(data, x, y, r = 1)
{
  const points = [
    [ x + 1, y ],
    [ x, y + 1 ],
    [ x - 1, y ],
    [ x, y - 1 ]
  ];
  return points
    .filter(([ px, py ]) =>
      px >= 0 && py >= 0 &&
px < data.width * r && py < data.height * r);
}

function getPathRisk(data, r)
{
  // start open paths at (0, 0) top left
  const open = {
    '0,0': [ 0, estimate(data, 0, 0, 0) ]
  };
  // keep track of closed paths whos neighbors have been investigated
  const closed = {};

  // repeat until we've reached the bottom right
  while (`${data.width * r - 1},${data.height * r - 1}` in closed === false)
  {
    debug('open:', open);
    debug('closed:', closed);

    // Sanity check
    if (Object.keys(open).length === 0)
    {
      throw new Error('No more open paths! Unable to reach end point!');
    }

    // move the most promising entry (x,y) on open to closed
    const min = Math.min(...Object.values(open).map(v => v[1]));
    debug('min:', min);
    const [ x, y ] = Object.entries(open)
      .find(([ , v ]) => v[1] === min)
      .shift()
      .split(',')
      .map(v => parseInt(v, 10));
    debug('[x, y]', [ x, y ]);

    const key = `${x},${y}`;
    const [ d, e ] = open[key];
    debug('[d, e]', [ d, e ]);
    closed[key] = [ d, e ];
    delete open[key];

    // move neighbors of (x,y) to open if they are not already on closed
    getNeighbors(data, x, y, r).forEach(([ v, w ]) =>
    {
      debug('neighbor:', [ v, w ]);
      if (`${v},${w}` in closed === false)
      {
        const d00 = Math.min(
          (open[`${v},${w}`] || [ 999999999999 ])[0],
          d + riskLevel(data, v, w));
        open[`${v},${w}`] = [ d00, estimate(data, v, w, d00, r) ];
      }
    });
  }

  debug('cost:', closed[`${data.width * r - 1},${data.height * r - 1}`][0]);

  return closed[`${data.width * r - 1},${data.height * r - 1}`][0];
}

function solve1(data)
{
  return getPathRisk(data, 1);
}

function solve2(data)
{
  return getPathRisk(data, 5);
}

export default async function day15(target)
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
    .map(v => v.split('').map(c => parseInt(c, 10)));
  /* eslint-enable no-shadow */

  // Insert width and height property for convenience
  data.width = data[0].length;
  data.height = data.length;

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 40)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 40`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 315)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 315`);
  }

  return { day: 15, part1, part2, duration: Date.now() - start };
}
