const fs = require ('fs');

function countIncreases(data)
{
  return data
    .map((v, i, a) => i > 0 ? v > a[i - 1] ? 1 : 0 : 0)
    .reduce((a, v) => a + v, 0);
}

function window(data, size)
{
  const result = [];

  for (let idx = 0; idx <= data.length - size; idx++)
  {
    result.push(data.slice(idx, idx + size).reduce((a, v) => a + v, 0));
  }
  return result;

  /*
  return data
    .map((v, i, d) => d.slice(i, i + size))
    .filter(v => v.size < size)
    .map(v => v.reduce((a, v) => a + v, 0));
  */
}

fs.readFile('input1.txt', (err, content) =>
{
  if (err)
  {
    console.error(err.message);
    return;
  }
  const data = content
    .toString()
    .trim()
    .split('\n')
    .map(v => parseInt(v, 10));

  console.log(`${countIncreases(window(data, 3))} depth increases`);
});

