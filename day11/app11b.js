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

    let steps = 0;
    const maxSteps = 100000;
    const w = data[0].length;
    const h = data.length;
    const flashPoints = [];

    do
    {
      // Reset flash points array
      flashPoints.length = 0;

      // Increment each cell by 1
      data.forEach((row, y) => data[y] = row.map(v => v + 1));

      while (data.some(row => row.some(c => c > 9)))
      {
        data.forEach((row, y) =>
        {
          row.forEach((col, x) =>
          {
            if (col < 10) { return; }

            // Only flash once per step
            if (flashPoints.every(p => p.x !== x || p.y !== y))
            {
              // Need to 'flash'
              flashPoints.push({ x: x, y: y });

              // Increment all adjecent cells, also diagonally
              const increment = [
                { y: y - 1, x: x - 1 },
                { y: y - 1, x: x },
                { y: y - 1, x: x + 1 },
                { y: y, x: x - 1 },
                { y: y, x: x + 1 },
                { y: y + 1, x: x - 1 },
                { y: y + 1, x: x },
                { y: y + 1, x: x + 1 }
              ];
              increment.forEach(p =>
              {
                if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h)
                {
                  data[p.y][p.x]++;
                }
              });
            }
          });
          data[y] = row;
        });

        // Reset value for all points that flashed to 0
        flashPoints.forEach(p => data[p.y][p.x] = 0);
      }

      steps++;
    } while (steps < maxSteps && flashPoints.length !== w * h);

    callback(null, steps);
  });
}

solve('test11.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 195)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input11.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('first step all octopuses flash:', answer2);
  });
});
