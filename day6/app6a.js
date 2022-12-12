const fs = require ('fs');

const LanternFish = require('./lanternfish');

// All the fish
const ocean = [];

function solve(filename, days, callback)
{
  // Empty the ocean
  ocean.length = 0;

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
      .map(v => parseInt(v, 10))
    ;

    // Sanity check on the data
    if (data.some(v => isNaN(v)))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    // Put all Lanternfish in the ocean
    data.forEach(v => ocean.push(new LanternFish(v)));

    for (let t = 0; t < days; t++)
    {
      ocean.forEach(v =>
      {
        const child = v.liveOneDay();
        if (child)
        {
          ocean.push(child);
        }
      });
    }
    callback(null, ocean.length);
  });
}

const cases = [
  { days: 80, number: 5934 }
];

cases.forEach(c =>
{
  solve('test6.txt', c.days, (err, answer) =>
  {
    if (err)
    {
      throw err;
    }

    if (answer === c.number)
    {
      console.log('Test case succeeded');
    }
    else
    {
      console.error('Test case failed!');
      return;
    }

    solve('input6.txt', c.days, (err, answer) =>
    {
      if (err)
      {
        throw err;
      }
      console.log(`Population after ${c.days} days:`, answer);
    });
  });
});
