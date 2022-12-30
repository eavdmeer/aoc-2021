const fs = require ('fs');

function countIncreases(data)
{
  return data
    .map((v, i, a) => i > 0 ? v > a[i - 1] ? 1 : 0 : 0)
    .reduce((a, v) => a + v, 0);
}

function runTests()
{
  console.log('Running test cases...');
  const cases = [
    { data: [ 1, 2, 3, 4 ], expect: 3 },
    { data: [ 4, 3, 2, 1 ], expect: 0 },
    { data: [ 1, 2, 1, 4 ], expect: 2 },
    { data: [ 2, 1, 3, 4 ], expect: 2 },
    { data: [ 2, 1, 3, 2 ], expect: 1 }
  ];
  cases.forEach(c =>
  {
    if (countIncreases(c.data) != c.expect)
    {
      throw Error(`failed for [${c.data}]`);
    }
  });
  console.log('All test cases succeeded');
}

runTests();

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

  console.log(`${countIncreases(data)} depth increases`);
});
