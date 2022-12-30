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
      .split(/\n/)
      .map(v => v.split('').map(i => parseInt(i, 10)));

    // Sanity check on the data
    if (data.some(v => v.some(d => isNaN(d))))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    const width = data[0].length;
    const height = data.length;

    const lowPoints = [];

    for (let y = 0; y < data.length; y++)
    {
      for(let x = 0; x < data[0].length; x++)
      {
        const h = data[y][x];
        if (
          (x - 1 < 0 || data[y][x - 1] > h) &&
          (x + 1 >= width || data[y][x + 1] > h) &&
          (y - 1 < 0 || data[y - 1][x] > h) &&
          (y + 1 >= height || data[y + 1][x] > h)
        )
        {
          lowPoints.push({ y: y, x: x, h: h });
        }
      }
    }

    callback(null, lowPoints.reduce((a, v) => a + 1 + v.h, 0));
  });
}

solve('test9.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 15)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input9.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('risk level:', answer2);
  });
});
