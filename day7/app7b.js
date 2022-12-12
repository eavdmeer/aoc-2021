const fs = require('fs');

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
      .split(/\s*,\s*/)
      .map(v => parseInt(v, 10));

    // Sanity check on the data
    if (data.some(v => isNaN(v)))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    const range = { min: Math.min(...data), max: Math.max(...data) };
    const consumption = [];
    let cost = 0,
      last = 0;
    for (let steps = 0; steps < 1 + range.max - range.min; steps++)
    {
      last += cost++;
      consumption.push(last);
    }

    const scores = {};
    for (let p = range.min; p <= range.max; p++)
    {
      scores[p] = data.reduce((a, v) => a + consumption[Math.abs(v - p)], 0);
    }
    const minFuel = Math.min(...Object.values(scores));

    const best = Object.entries(scores).find(([ , v ]) => v === minFuel);

    callback(null, best);
  });
}

solve('test7.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }
  if (answer.join(', ') !== '5, 168')
  {
    console.error(`Test case failed! (${answer})`);
    return;
  }

  console.log('Test case succeded');

  solve('input7.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log(`minimum fuel cost is ${answer2[1]} at pos: ${answer2[0]}`);
  });
});
