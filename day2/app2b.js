const fs = require ('fs');

fs.readFile('input2.txt', (err, content) =>
{
  if (err)
  {
    console.error(err.message);
    return;
  }


  /*
    down X increases your aim by X units.
    up X decreases your aim by X units.
    forward X does two things:
    It increases your horizontal position by X units.
    It increases your depth by your aim multiplied by X.
  */
  const program = content
    .toString()
    .trim()
    .split('\n')
    .map(v => v
      .replace(/down (\d+)/, 'aim += $1;')
      .replace(/up (\d+)/, 'aim -= $1;')
      .replace(/forward (\d+)/, 'pos += $1; depth += aim * $1;')
      .replace(/backward (\d+)/, 'pos -= $1;')
      .replace(/$/, 'console.log("aim = ", aim, "pos =", pos, "depth = ", depth);')
    )
    .join('');

  let aim = 0, pos = 0, depth = 0;
  eval(program);

  console.log(`aim: ${aim} position: ${pos}, depth: ${depth}`);
  console.log(`multiplied: ${pos * depth}`);
});
