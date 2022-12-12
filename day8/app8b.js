const fs = require('fs');

/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

const segment = {
  0: { on: 'abcefg', off: 'd' },
  1: { on: 'cf', off: 'abdeg' },
  2: { on: 'acdeg', off: 'bf' },
  3: { on: 'acdfg', off: 'be' },
  4: { on: 'bcdf', off: 'aeg' },
  5: { on: 'abdfg', off: 'ce' },
  6: { on: 'abdefg', off: 'c' },
  7: { on: 'acf', off: 'bdeg' },
  8: { on: 'abcdefg', off: '' },
  9: { on: 'abcdfg' off: 'e' }
};

const segment = {
  cf: 1,
  acf: 7,
  bcdf: 4,
  abcdefg: 8

5 digits
  2: 'acdeg',
  3: 'acdfg',
  5: 'abdfg',

6 digits
  0: 'abcefg',
  6: 'abdefg',
  9: 'abcdfg'
};

*/

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

function solve(filename, callback)
{
  fs.readFile(filename, (err, content) =>
  {
    if (err)
    {
      callback(err);
      return;
    }
    const data = content
      .toString()
      .trim()
      .split(/\n/)
      .map(line => line
        .split(/\s+/)
        .filter(v => v !== '|'))
      .map(v => ({ input: v.slice(0, 10), output: v.slice(10, 14) }));

    // Sanity check on the data
    if (data.some(line =>
      line.input.some(v => ! /^[a-g]+$/.test(v)) ||
      line.output.some(v => ! /^[a-g]+$/.test(v)) ||
      line.input.length !== 10 ||
      line.output.length !== 4))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    callback(null, data.reduce((a, v) => a + decode(v.input, v.output), 0));
  });
}

solve('test8.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }
  if (answer !== 61229)
  {
    console.error(`Test case failed! (${answer})`);
    return;
  }

  console.log('Test case succeded');

  solve('input8.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('sum of all outputs:', answer2);
  });
});
