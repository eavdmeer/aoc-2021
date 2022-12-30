const fs = require ('fs');

fs.readFile('input2.txt', (err, content) =>
{
  if (err)
  {
    console.error(err.message);
    return;
  }
  const program = content
    .toString()
    .trim()
    .split('\n')
    .map(v => v
      .replace(/forward (\d+)/, 'pos += $1;')
      .replace(/backward (\d+)/, 'pos -= $1;')
      .replace(/down (\d+)/, 'depth += $1;')
      .replace(/up (\d+)/, 'depth -= $1;')
    )
    .join('');

  let pos = 0, depth = 0;
  eval(program);

  console.log(`position: ${pos}, depth: ${depth}`);
  console.log(`multiplied: ${pos * depth}`);
});
