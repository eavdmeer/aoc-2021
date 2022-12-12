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
      .map(line => line
        .split(/\s+/)
        .filter(v => v !== '|'))
      .map(v => ({ input: v.slice(0, 10), output: v.slice(10, 14) }));

    // Sanity check on the data
    if (data.some(line =>
      line.input.some(v => ! /^[a-g]+$/.test(v)) ||
      line.output.some(v => ! /^[a-g]+$/.test(v))))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    const count = data.reduce((a, line) =>
      a + line.output.filter(v =>
        [ 2, 3, 4, 7 ].includes(v.length)).length, 0);

    callback(null, count);
  });
}

solve('test8.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }
  if (answer !== 26)
  {
    console.error(`Test case failed! (${answer})`);
    return;
  }

  console.log('Test case succeded');

  solve('input8.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log(`${answer2} instances of digits 1, 4, 7, or 8`);
  });
});
