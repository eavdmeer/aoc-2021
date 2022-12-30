const fs = require('fs');

function basin(map, x, y)
{
  const data = Array.from(map);
  const width = map[0].length;
  const height = map.length;

  // mark coordinate as visited
  data[y][x] = 9;

  let result = 1;

  if (x - 1 >= 0 && data[y][x - 1] < 9)
  {
    result += basin(data, x - 1, y);
  }
  if (x + 1 < width && data[y][x + 1] < 9)
  {
    result += basin(data, x + 1, y);
  }
  if (y - 1 >= 0 && data[y - 1][x] < 9)
  {
    result += basin(data, x, y - 1);
  }
  if (y + 1 < height && data[y + 1][x] < 9)
  {
    result += basin(data, x, y + 1);
  }

  return result;
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

    const basins = lowPoints
      .map(v => basin(data, v.x, v.y))
      .sort((a, b) => b - a);

    callback(null, basins.slice(0, 3).reduce((a, v) => a * v, 1));
  });
}

solve('test9.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 1134)
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
