const fs = require('fs');

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
      drawing[y][x] = '.';
    }
  }

  // Put in the points from the data
  data.forEach(p =>
  {
    drawing[p.y][p.x] = '#';
  });

  console.log('drawing');
  console.log(drawing.map(r => r.join('')).join('\n'));
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
      .split(/\n/);

    const dots = data
      .filter(v => /^\d/.test(v))
      .map(v => v.split(/\s*,\s*/))
      .map(v => v.map(c => parseInt(c, 10)))
      .map(v => ({ x: v[0], y: v[1] }));
    const instructions = data
      .filter(v => /^fold along [xy]=\d+$/.test(v));

    // x-sort the dots
    dots.sort((a, b) => a.x - b.x);

    if (filename === 'test13.txt')
    {
      console.log(dots);
      console.log(instructions);
    }

    // Sanity check on the data
    if (dots.some(v => isNaN(v.x) || isNaN(v.y)))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    // execute all instructions
    let mapped = Array.from(dots);
    if (filename === 'test13.txt') { draw(mapped); }
    instructions.slice(0, 1).forEach(inst =>
    {
      if (filename === 'test13.txt')
      {
        console.log('inst:', inst);
      }
      const axis = inst.replace(/^fold along ([xy])=\d+$/, '$1');
      const value = inst.replace(/^fold along [xy]=(\d+)$/, '$1');
      mapped = mapped
        .map(v => move(v, axis, parseInt(value, 10)))
        .filter((v, i, a) => a
          .findIndex(c => v.x === c.x && v.y === c.y) === i);

      if (filename === 'test13.txt') { draw(mapped); }
    });

    // x-sort the mapped
    mapped.sort((a, b) => a.x - b.x);

    callback(null, mapped.length);
  });
}

const cases = [
  { input: { x: 0, y: 0 }, axis: 'x', val: 10, output: { x: 0, y: 0 } },
  { input: { x: 0, y: 0 }, axis: 'y', val: 10, output: { x: 0, y: 0 } },

  { input: { x: 0, y: 10 }, axis: 'x', val: 9, output: { x: 0, y: 10 } },
  { input: { x: 10, y: 0 }, axis: 'y', val: 9, output: { x: 10, y: 0 } },

  { input: { x: 0, y: 10 }, axis: 'x', val: 10, output: { x: 0, y: 10 } },
  { input: { x: 10, y: 0 }, axis: 'y', val: 10, output: { x: 10, y: 0 } }
];
if (cases.some(c =>
{
  const m = move(c.input, c.axis, c.val);
  if (c.output.x !== m.x || c.output.y !== m.y)
  {
    console.log('found:', m, 'expecting:', c.output);
    return true;
  }
  return false;
}))
{
  throw new Error('move test failed');
}
console.log('Move test cases succeeded');

solve('test13.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 17)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input13.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('dots after first fold:', answer2);
  });
});
