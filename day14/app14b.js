const fs = require('fs');

function adjustCount(obj, key, count)
{
  obj[key] = obj[key] ? obj[key] + count : count;
}

function splitPairs(template)
{
  // Break down the template into pairs
  const pairs = template
    .split('')
    .map((v, i, o) => `${v}${o[i + 1]}`);
  pairs.pop();

  const result = {};
  pairs.forEach(v => adjustCount(result, v, 1));

  return result;
}

function step(template, map, n)
{
  const pairs = splitPairs(template);

  for (let i = 0; i < n; i++)
  {
    const newPairs = {};
    Object.entries(pairs).forEach(([ pair, count ]) =>
    {
      if (count === 0) { return; }
      pairs[pair] -= count;
      adjustCount(newPairs, `${pair[0]}${map[pair]}`, count);
      adjustCount(newPairs, `${map[pair]}${pair[1]}`, count);
    });
    Object.entries(newPairs).forEach(([ pair, count ]) =>
    {
      adjustCount(pairs, pair, count);
    });
  }

  // Count the first letter of each pair
  const counts = {};
  Object.entries(pairs).forEach(([ pair, count ]) =>
  {
    adjustCount(counts, pair[0], count);
  });
  // Make sure the last letter is counted
  adjustCount(counts, template[template.length - 1], 1);

  return Math.max(...Object.values(counts)) -
    Math.min(...Object.values(counts));
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

    const answer = step(template, map, 40);

    callback(null, answer);
  });
}

solve('test14.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 2188189693529)
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
