import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day08');

if (process.argv[2])
{
  day08(process.argv[2]).then(console.log);
}

function intersection(array1, array2)
{
  return array1.filter(value => array2.includes(value));
}

function difference(array1, array2)
{
  return array1.filter(x => !array2.includes(x));
}

function translate(input, mapping)
{
  return input
    .split('')
    .map(c => mapping[c])
    .sort()
    .join('');
}

function decode(input, output)
{
  const mapping = { a: [], b: [], c: [], d: [], e: [], f: [], g: [] };

  // Search for characters:
  // '1' (2 segments)
  // '7' (3 segments with 2 the same as '1')
  // '4' (4 segments with 2 the same as '1')
  // '8' (7 segments)
  const search = [
    { len: 2, opt: [ 'c', 'f' ] },
    { len: 3, opt: [ 'a' ] },
    { len: 4, opt: [ 'b', 'd' ] },
    { len: 7, opt: [ 'e', 'g' ] }
  ];

  search.forEach(row =>
  {
    const match = input.find(v => v.length === row.len);
    match.split('').forEach(i =>
    {
      if (! Object.values(mapping).some(v => v.includes(i)))
      {
        row.opt.forEach(c => mapping[c].push(i));
      }
    });
  });

  // Find length 6 entries
  const matches = input.filter(v => v.length === 6);

  // Find the three segments that are not in those
  const missing = matches
    .map(v => difference([ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ], v).pop());

  mapping.c = intersection(mapping.c, missing);
  mapping.f = difference(mapping.f, mapping.c);

  mapping.d = intersection(mapping.d, missing);
  mapping.b = difference(mapping.b, mapping.d);

  mapping.e = intersection(mapping.e, missing);
  mapping.g = difference(mapping.g, mapping.e);

  // Sanity check
  if (Object.values(mapping).some(v => v.length !== 1))
  {
    throw new Error('Failed to find a full translation');
  }

  // Flatten the mapping
  Object.keys(mapping).forEach(k => mapping[k] = mapping[k][0]);

  // Reverse the mapping
  const reverse = {};
  Object.entries(mapping).forEach(([ k, v ]) => reverse[v] = k);

  // Translate the output into digits
  const segment = {
    cf: '1',
    acdeg: '2',
    acdfg: '3',
    bcdf: '4',
    abdfg: '5',
    abdefg: '6',
    acf: '7',
    abcdefg: '8',
    abcdfg: '9',
    abcefg: '0'
  };
  const digits = output.map(v => translate(v, reverse)).map(v => segment[v]);

  // Sanity check
  if (digits.some(v => /^\s+$/.test(v)))
  {
    console.log('output:', output);
    console.log('translation table:', reverse);
    throw new Error('Unable to translate al digits!');
  }

  return parseInt(digits.join(''), 10);
}

function solve1(data)
{
  return data.reduce((a, line) =>
    a + line.output.filter(v =>
      [ 2, 3, 4, 7 ].includes(v.length)).length, 0);
}

function solve2(data)
{
  return data.reduce((a, v) => a + decode(v.input, v.output), 0);
}

export default async function day08(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\n/)
    .map(line => line
      .split(/\s+/)
      .filter(v => v !== '|'))
    .map(v => ({ input: v.slice(0, 10), output: v.slice(10, 14) }));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 26)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 26`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 61229)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 61229`);
  }

  return { day: 8, part1, part2, duration: Date.now() - start };
}
