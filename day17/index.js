import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day17');

if (process.argv[2])
{
  day17(process.argv[2]).then(console.log);
}

function xPositions(speed, max)
{
  const result = [];
  let v = speed;
  for (let p = v; p <= max; p += v--)
  {
    result.push(p);
    if (v === 0) { break; }
  }
  return result;
}

function step(pos, vel)
{
  /*
    x position increases by its x velocity.
    y position increases by its y velocity.
    x velocity changes by 1 toward the value 0;
      it decreases by 1 if it is greater than 0,
      increases by 1 if it is less than 0,
      or does not change if it is already 0.
    y velocity decreases by 1.
  */
  pos.x += vel.x;
  pos.y += vel.y;
  vel.x += vel.x === 0 ? 0 : vel.x > 0 ? -1 : 1;
  vel.y--;
}

function within(area, pos)
{
  return pos.x >= area.xMin &&
    pos.x <= area.xMax &&
    pos.y >= area.yMin &&
    pos.y <= area.yMax;
}

function solve1(data)
{
  const target = {
    xMin: Math.min(...data.slice(0, 2)),
    xMax: Math.max(...data.slice(0, 2)),
    yMin: Math.min(...data.slice(2, 4)),
    yMax: Math.max(...data.slice(2, 4))
  };
  debug(target);

  // Calculate the minimum x-speed required to reach the target
  let vMin = 0;
  let xMax = 0;
  do
  {
    vMin++;
    xMax += vMin;
    debug('vMin:', vMin, 'xMax', xMax);
  } while (xMax < target.xMin);
  debug('minimum speed:', vMin);

  // Find all x-speeds that will land inside the target
  const xSpeeds = [];
  for (let v = vMin; v <= target.xMax; v++)
  {
    if (xPositions(v, target.xMax)
      .some(x => within(target, { x, y: target.yMin })))
    {
      xSpeeds.push(v);
    }
  }
  debug('xSpeeds:', xSpeeds);

  const heights = [];

  xSpeeds.forEach(vx =>
  {
    for (let vy = 0; vy < 900; vy++)
    {
      const path = [];
      debug('vx:', vx, 'vy:', vy);
      const pos = { x: 0, y: 0 };
      const vel = { x: vx, y: vy };
      path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
      while (pos.x < target.xMax && pos.y > target.yMin)
      {
        step(pos, vel);
        path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
        if (within(target, pos))
        {
          debug(path);
          debug('bullseye!', pos, 'vel:', { vx, vy });
          heights.push(Math.max(...Object.values(path).map(v => v.y)));
          break;
        }
      }
    }
  });
  debug('heights:', heights);

  return Math.max(...heights);
}

function solve2(data)
{
  const target = {
    xMin: Math.min(...data.slice(0, 2)),
    xMax: Math.max(...data.slice(0, 2)),
    yMin: Math.min(...data.slice(2, 4)),
    yMax: Math.max(...data.slice(2, 4))
  };
  debug(target);

  // Calculate the minimum x-speed required to reach the target
  let vMin = 0;
  let xMax = 0;
  do
  {
    vMin++;
    xMax += vMin;
    debug('vMin:', vMin, 'xMax', xMax);
  } while (xMax < target.xMin);
  debug('minimum speed:', vMin);

  // Find all x-speeds that will land inside the target
  const xSpeeds = [];
  for (let v = vMin; v <= target.xMax; v++)
  {
    if (xPositions(v, target.xMax)
      .some(x => within(target, { x, y: target.yMin })))
    {
      xSpeeds.push(v);
    }
  }
  debug('xSpeeds:', xSpeeds);

  const velocities = [];

  // xSpeeds.forEach(vx =>
  for (let vx = 1; vx <= target.xMax; vx++)
  {
    for (let vy = -1950; vy < 1900; vy++)
    {
      const path = [];
      debug('vx:', vx, 'vy:', vy);
      const pos = { x: 0, y: 0 };
      const vel = { x: vx, y: vy };
      path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
      while (pos.x < target.xMax && pos.y > target.yMin)
      {
        step(pos, vel);
        path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
        if (within(target, pos))
        {
          debug(path);
          debug('bullseye!', pos, 'vel:', { vx, vy });
          velocities.push(`[ ${vx}, ${vy}]`);
          break;
        }
      }
    }
  }
  const answer = velocities.filter((v, i, o) => o.indexOf(v) === i);

  return answer.length;
}

export default async function day17(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .match(/^target area: x=(.+)\.\.(.+), y=(.+)\.\.(.+)$/);
  /* eslint-enable no-shadow */

  // Clean up regex match output
  data.shift();
  delete data.index;
  delete data.input;
  delete data.groups;

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 45)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 45`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 112)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 112`);
  }

  return { day: 17, part1, part2, duration: Date.now() - start };
}
