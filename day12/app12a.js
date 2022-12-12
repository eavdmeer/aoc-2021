const fs = require('fs');

function walk(routes, destinations, route, loc)
{
  // Avoid visiting the same lower case node more than once
  const duplicate = /^[a-z]+$/.test(loc) && route.some(v => v === loc);
  route.push(loc);
  if (duplicate) { return; }

  // Detect complete rout
  if (loc === 'end')
  {
    routes.push(Array.from(route));
    return;
  }

  // Try all paths from here
  destinations[loc].forEach(d =>
  {
    walk(routes, destinations, route, d);
    route.pop();
  });
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
      .map(v => v.split('-'));

    // Sanity check on the data
    if (data.some(v => v.length !== 2 || v.some(c => ! /^[a-zA-Z]+$/.test(c))))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    // map all destinations form each node
    const destinations = {};
    data.forEach(([ from, to ]) =>
    {
      destinations[from] = destinations[from] ? destinations[from] : [];
      destinations[from].push(to);
    });
    data.forEach(([ to, from ]) =>
    {
      if (to === 'start' || from === 'end') { return; }
      destinations[from] = destinations[from] ? destinations[from] : [];
      destinations[from].push(to);
    });

    const routes = [];
    const route = [];
    walk(routes, destinations, route, 'start');

    callback(null, routes.length);
  });
}

solve('test12.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 10)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input12.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('routes through the caves:', answer2);
  });
});
