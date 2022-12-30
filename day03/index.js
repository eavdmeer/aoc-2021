import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day03');

if (process.argv[2])
{
  day03(process.argv[2]).then(console.log);
}

function solve1(data)
{
  let gamma = '';
  let epsilon = '';

  const size = data.length;

  data[0].forEach((v, i) =>
  {
    const high = data
      .filter(d => d[i] === '1')
      .length;
    debug(`col ${i} ${high}/${size} high`);

    gamma += high > size / 2 ? '1' : '0';
    epsilon += high > size / 2 ? '0' : '1';
  });
  gamma = parseInt(gamma, 2);
  epsilon = parseInt(epsilon, 2);

  debug('gamma:', gamma, 'epsilon:', epsilon, 2);
  debug('multiplied:', gamma * epsilon);

  return gamma * epsilon;
}

function solve2(data)
{
  /*
    Start with the full list of binary numbers from your diagnostic report
    and consider just the first bit of those numbers. Then:

     - Keep only numbers selected by the bit criteria for the type of
     rating value for which you are searching. Discard numbers which do not
     match the bit criteria.
    - If you only have one number left, stop; this is the rating value for
      which you are searching.
    - Otherwise, repeat the process, considering the next bit to the right.
      The bit criteria depends on which type of rating value you want to find:

    To find oxygen generator rating, determine the most common value (0 or
    1) in the current bit position, and keep only numbers with that bit in
    that position. If 0 and 1 are equally common, keep values with a 1 in
    the position being considered.

    To find CO2 scrubber rating, determine the least common value (0 or 1)
    in the current bit position, and keep only numbers with that bit in
    that position. If 0 and 1 are equally common, keep values with a 0 in
    the position being considered.
  */

  // find oxygen generator rating
  let workset = Array.from(data);
  data[0].forEach((v, i) =>
  {
    const size = workset.length;
    if (size === 1)
    {
      return;
    }
    const high = workset
      .filter(d => d[i] === '1')
      .length;
    const mostCommon = high < size / 2 ? '0' : '1';
    debug(`col ${i} most common: ${mostCommon}`);
    workset = workset.filter(d => d[i] === mostCommon);
  });
  const oxygen = parseInt(workset.pop().join(''), 2);

  // find CO2 scrubber rating
  workset = Array.from(data);
  data[0].forEach((v, i) =>
  {
    const size = workset.length;
    if (size === 1)
    {
      return;
    }
    const high = workset
      .filter(d => d[i] === '1')
      .length;
    const leastCommon = high < size / 2 ? '1' : '0';
    debug(`col ${i}: len: ${size}, '1': ${high}, '0': ${size - high}, least common: '${leastCommon}'`);
    workset = workset.filter(d => d[i] === leastCommon);
  });
  debug('workset', workset);
  const co2scrubber = parseInt(workset.pop().join(''), 2);

  debug('oxygen:', oxygen, 'co2 scrubber', co2scrubber);
  debug('multiplied:', oxygen * co2scrubber);

  return oxygen * co2scrubber;
}

export default async function day03(target)
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
    .map(v => [ ...v ]);
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 198)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 198`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 230)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 230`);
  }

  return { day: -1, part1, part2, duration: Date.now() - start };
}
