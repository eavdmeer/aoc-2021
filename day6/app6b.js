const fs = require('fs');

function findDistribution(data)
{
  const distribution = {};
  data.forEach(v => distribution[v] = distribution[v] ?
    distribution[v] + 1 : 1);

  return distribution;
}

function populationAfterDays(distribution, days)
{
  // Calculate end population for each timer value afther the days
  const population = {};
  Object.entries(distribution).forEach(([ v, base ]) =>
  {
    // All the fish
    const ocean = [];
    ocean.push(v);
    for (let t = 0; t < days; t++)
    {
      ocean.forEach((timer, i) =>
      {
        ocean[i]--;
        if (ocean[i] < 0)
        {
          ocean[i] = 6;
          ocean.push(8);
        }
      });
    }
    const nextgen = findDistribution(ocean);

    Object.keys(nextgen).forEach(k => population[k] =
      (population[k] || 0) + base * nextgen[k]);
  });

  return population;
}

function solve(filename, days, callback)
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


    // Find unique timer values and poplation count for all fish
    let population = findDistribution(data);

    const blockSize = 50;
    for (let loop = 0; loop < Math.floor(days / blockSize); loop++)
    {
      population = populationAfterDays(population, blockSize);
    }
    if (days % blockSize)
    {
      population = populationAfterDays(population, days % blockSize);
    }

    // Calculate the sum for all fish
    const total = Object.values(population)
      .reduce((a, v) => a + v);

    callback(null, total);
  });
}

const cases = [
  { days: 40, number: 174 },
  { days: 80, number: 5934 },
  { days: 160, number: 6311710 },
  { days: 180, number: 35890123 },
  { days: 200, number: 204394337 },
  { days: 256, number: 26984457539 }
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
      console.error(`Test case failed (${answer})!`);
      return;
    }

    solve('input6.txt', c.days, (err, answer2) =>
    {
      if (err)
      {
        throw err;
      }
      console.log(`Population after ${c.days} days:`, answer2);
    });
  });
});
