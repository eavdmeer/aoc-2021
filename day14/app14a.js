const fs = require('fs');

function step(template, map)
{
  // Break down the template into pairs
  const pairs = template
    .split('')
    .map((v, i, o) => `${v}${o[i + 1]}`);

  return pairs.map(p => map[p] ? `${p[0]}${map[p]}` : p[0]).join('');
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

    const template = data[0];
    const rules = data
      .filter(v => /^[A-Z]+\s*->\s*[A-Z]+$/.test(v))
      .map(v => v.split(/\s*->\s*/))
      .map(v => ({ from: v[0], to: v[1] }));

    // Sanity check on the data
    if (! /^[A-Z]+$/.test(template))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    const map = {};
    rules.forEach(v => map[v.from] = v.to);

    let polymer = template;
    for (let t = 0; t < 10; t++)
    {
      polymer = step(polymer, map);
    }

    const uniq = polymer
      .split('')
      .filter((v, i, o) => o.indexOf(v) !== i);
    uniq.sort();

    const counts = {};
    uniq.forEach(f => counts[f] = 0);
    polymer
      .split('')
      .forEach(c => counts[c]++);

    const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);

    callback(null, sorted.pop()[1] - sorted.shift()[1]);
  });
}

solve('test14.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 1588)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input14.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('difference between most and least common element:', answer2);
  });
});
