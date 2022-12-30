const fs = require ('fs');

function draw(map)
{
  const xvals = Object.keys(map)
    .map(k => parseInt(k.replace(/^(\d+)-\d+$/, '$1'), 10));
  const yvals = Object.keys(map)
    .map(k => parseInt(k.replace(/^\d+-(\d+)$/, '$1'), 10));
  const xrange = {
    min: Math.min(...xvals),
    max: Math.max(...xvals)
  };
  const yrange = {
    min: Math.min(...yvals),
    max: Math.max(...yvals)
  };

  for (let y = yrange.min; y <= yrange.max; y++)
  {
    let line = '';
    for (let x = xrange.min; x <= xrange.max; x++)
    {
      line += map[`${x}-${y}`] || '.';
    }
    console.log(line);
  }
}

function walk(map, path)
{
  // console.log('path:', path);

  const xrange = {
    min: Math.min(path[0], path[2]),
    max: Math.max(path[0], path[2])
  };
  const yrange = {
    min: Math.min(path[1], path[3]),
    max: Math.max(path[1], path[3])
  };

  // If not verticle, the line is:
  //
  //   y = a * x + b
  //
  // where:
  //
  //   path[1] = a * path[0] + b
  //   path[3] = a * path[2] + b
  //
  // so:
  //
  //   b = path[1] - a * path[0]
  //   b = path[3] - a * path[2]
  //
  //   path[1] - a * path[0] = path[3] - a * path[2]
  //   path[1] - path[3] = a * (path[0] - path[2])
  //
  //   a = (path[1] - path[3]) / (path[0] - path[2])

  if (path[0] !== path[2])
  {
    const a = (path[1] - path[3]) / (path[0] - path[2]);
    const b = path[1] - a * path[0];
    // console.log(`line: y = ${a} * x + ${b}`);
    for (let x = xrange.min; x <= xrange.max; x++)
    {
      let y = a * x + b;
      // console.log(`walking ${x}, ${y}`);
      const key = `${x}-${y}`;
      map[key] = (map[key] || 0) + 1;
    }
  }
  else
  {
    let x = path[0];
    for (let y = yrange.min; y <= yrange.max; y++)
    {
      // console.log(`walking ${x}, ${y}`);
      const key = `${x}-${y}`;
      map[key] = (map[key] || 0) + 1;
    }
  }
}

function solve(filename, allowDiagonal, callback)
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
      .split('\n')
      .filter(v => v != '')
      .map(v => v
        .trim()
        .split(/\s*,\s*|\s*->\s*/)
        .map(v => parseInt(v, 10)))
    ;

    // Sanity check on the data
    if (data.some(v => v.length !== 4 || v.some(d => isNaN(d))))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    // Walk over the map on the lines, but only horizontal and vertical ones
    const map = {};

    const paths = allowDiagonal ? data :
      data.filter(v => v[0] === v[2] || v[1] == v[3]);

    paths.forEach(path => walk(map, path));

    callback(null, map);
  });
}

solve('test5.txt', false, (err, map) =>
{
  if (err)
  {
    throw err;
  }

  const answwer = Object.values(map).filter(v => v > 1).length;
  if (answwer !== 5)
  {
    console.error('First part test case failed!');
    draw(map);
    return;
  }
  else
  {
    console.log('First part test case succeeded');
  }
  solve('input5.txt', false, (err, map) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('First part solution:',
      Object.values(map).filter(v => v > 1).length);
  });
});

solve('test5.txt', true, (err, map) =>
{
  if (err)
  {
    throw err;
  }

  const answwer = Object.values(map).filter(v => v > 1).length;
  if (answwer !== 12)
  {
    console.error('Second part test case failed!');
    draw(map);
    return;
  }
  else
  {
    console.log('Second part test case succeeded');
  }
  solve('input5.txt', true, (err, map) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('Second part solution:',
      Object.values(map).filter(v => v > 1).length);
  });
});
