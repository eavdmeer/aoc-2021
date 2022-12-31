import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day13');

if (process.argv[2])
{
  day13(process.argv[2]).then(console.log);
}

function getRange(data)
{
  return {
    x: Math.max(...data.map(p => p.x)),
    y: Math.max(...data.map(p => p.y))
  };
}

function draw(data)
{
  const range = getRange(data);

  // Create an empty drawing
  const drawing = [];
  for (let y = 0; y <= range.y; y++)
  {
    drawing[y] = [];
    for (let x = 0; x <= range.x; x++)
    {
      drawing[y][x] = ' ';
    }
  }

  // Put in the points from the data
  data.forEach(p =>
  {
    drawing[p.y][p.x] = '#';
  });

  console.log('drawing');
  return drawing.map(r => r.join(''));
}

function move(v, axis, value)
{
  if (axis === 'y')
  {
    if (v.y > value)
    {
      return { x: v.x, y: value - (v.y - value) };
    }
  }
  else if (axis === 'x')
  {
    if (v.x > value)
    {
      return { x: value - (v.x - value), y: v.y };
    }
  }
  else
  {
    throw new Error(`unknown axis: ${axis}!`);
  }

  return { x: v.x, y: v.y };
}

function getMapped(data, full = false)
{
  const dots = data
    .filter(v => /^\d/.test(v))
    .map(v => v.split(/\s*,\s*/))
    .map(v => v.map(c => parseInt(c, 10)))
    .map(v => ({ x: v[0], y: v[1] }));
  const instructions = data
    .filter(v => /^fold along [xy]=\d+$/.test(v));

  // x-sort the dots
  dots.sort((a, b) => a.x - b.x);

  debug(dots);
  debug(instructions);

  // execute all instructions
  let mapped = Array.from(dots);
  instructions.slice(0, full ? instructions.length : 1).forEach(inst =>
  {
    debug('inst:', inst);
    const axis = inst.replace(/^fold along ([xy])=\d+$/, '$1');
    const value = inst.replace(/^fold along [xy]=(\d+)$/, '$1');
    mapped = mapped
      .map(v => move(v, axis, parseInt(value, 10)))
      .filter((v, i, a) => a
        .findIndex(c => v.x === c.x && v.y === c.y) === i);
  });

  return mapped;
}

function solve1(data)
{
  return getMapped(data).length;
}

function solve2(data)
{
  const mapped = getMapped(data, true);

  const drawing = draw(mapped);
  debug(drawing);

  return drawing;
}

export default async function day13(target)
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
  if (target.includes('example') && part1 !== 17)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 17`);
  }

  const part2 = solve2(data);
  const drawing = [
    '#####',
    '#   #',
    '#   #',
    '#   #',
    '#####' ];
  if (target.includes('example') &&
    JSON.stringify(part2) !== JSON.stringify(drawing))
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 'todo'`);
  }

  return { day: 13, part1, part2, duration: Date.now() - start };
}
