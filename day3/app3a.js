const fs = require ('fs');

fs.readFile('input3.txt', (err, content) =>
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
    .map(v => [ ...v ])
  ;

  let gamma = '', epsilon = '';

  let size = data.length;

  data[0].forEach((v, i) =>
  {
    const high = data
      .filter(d => d[i] === '1')
      .length;
    console.log(`col ${i} ${high}/${size} high`);

    gamma += high > size / 2 ? '1' : '0';
    epsilon += high > size / 2 ? '0' : '1';
  });
  gamma = parseInt(gamma, 2);
  epsilon = parseInt(epsilon, 2);

  console.log('gamma:', gamma, 'epsilon:', epsilon, 2);
  console.log('multiplied:', gamma * epsilon);
});
