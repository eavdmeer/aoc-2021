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
      .map(v => v.split('').map(c => parseInt(c, 10)));


    // Sanity check on the data
    if (data.some(row => row.some(col => isNaN(col))))
    {
      callback(new Error('Error reading data!'));
      return;

    }
    console.log(data);

    callback(null, 0);
  });
}

solve('test15.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 40)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input15.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('difference between most and least common element:', answer2);
  });
});
