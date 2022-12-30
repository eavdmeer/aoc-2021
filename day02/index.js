import * as fs from 'fs/promises';
import makeDebug from 'debug';

/* eslint-disable no-eval, prefer-const */

const debug = makeDebug('day02');

if (process.argv[2])
{
  day02(process.argv[2]).then(console.log);
}

function solve1(data)
{
  let depth = 0;
  let pos = 0;
  const program = data
    .map(v => v
      .replace(/down (\d+)/, 'depth += $1;')
      .replace(/up (\d+)/, 'depth -= $1;')
      .replace(/forward (\d+)/, 'pos += $1;')
      .replace(/backward (\d+)/, 'pos -= $1;')
      .replace(/$/, 'debug("pos =", pos, "depth = ", depth);')
    )
    .join('');
  debug('program:', program);
  eval(program);
  debug('position:', pos, 'depth:', depth);

  return pos * depth;
}

function solve2(data)
{
  let pos = 0;
  let depth = 0;
  let aim = 0;
  const program = data
    .map(v => v
      .replace(/down (\d+)/, 'aim += $1;')
      .replace(/up (\d+)/, 'aim -= $1;')
      .replace(/forward (\d+)/, 'pos += $1; depth += aim * $1;')
      .replace(/backward (\d+)/, 'pos -= $1;')
      .replace(/$/, 'debug("aim = ", aim, "pos =", pos, "depth = ", depth);')
    )
    .join('');
  debug('program:', program);
  eval(program);
  debug('aim:', aim, 'position:', pos, 'depth:', depth);

  return pos * depth;
}

export default async function day02(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /*
    down X increases your aim by X units.
    up X decreases your aim by X units.
    forward X does two things:
    It increases your horizontal position by X units.
    It increases your depth by your aim multiplied by X.
  */

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 150)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 150`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 900)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 900`);
  }

  return { day: 2, part1, part2, duration: Date.now() - start };
}
