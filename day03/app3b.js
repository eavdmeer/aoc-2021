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

  /*
    Start with the full list of binary numbers from your diagnostic report
    and consider just the first bit of those numbers. Then:

     - Keep only numbers selected by the bit criteria for the type of
     rating value for which you are searching. Discard numbers which do not
     match the bit criteria.
    - If you only have one number left, stop; this is the rating value for
      which you are searching.
    - Otherwise, repeat the process, considering the next bit to the right.
      The bit criteria depends on which type of rating value you want to find:

    To find oxygen generator rating, determine the most common value (0 or
    1) in the current bit position, and keep only numbers with that bit in
    that position. If 0 and 1 are equally common, keep values with a 1 in
    the position being considered.

    To find CO2 scrubber rating, determine the least common value (0 or 1)
    in the current bit position, and keep only numbers with that bit in
    that position. If 0 and 1 are equally common, keep values with a 0 in
    the position being considered.
  */

  // find oxygen generator rating
  let workset = Array.from(data);
  data[0].forEach((v, i) =>
  {
    const size = workset.length;
    if (size === 1)
    {
      return;
    }
    const high = workset
      .filter(d => d[i] === '1')
      .length;
    const mostCommon = high < size / 2 ? '0' : '1';
    console.log(`col ${i} most common: ${mostCommon}`);
    workset = workset.filter(d => d[i] === mostCommon);
  });
  const oxygen = parseInt(workset.pop().join(''), 2);

  // find CO2 scrubber rating
  workset = Array.from(data);
  data[0].forEach((v, i) =>
  {
    const size = workset.length;
    if (size === 1)
    {
      return;
    }
    const high = workset
      .filter(d => d[i] === '1')
      .length;
    const leastCommon = high < size / 2 ? '1' : '0';
    console.log(`col ${i}: len: ${size}, '1': ${high}, '0': ${size - high}, least common: '${leastCommon}'`);
    workset = workset.filter(d => d[i] === leastCommon);
  });
  console.log('workset', workset);
  const co2scrubber = parseInt(workset.pop().join(''), 2);

  console.log('oxygen:', oxygen, 'co2 scrubber', co2scrubber);
  console.log('multiplied:', oxygen * co2scrubber);
});
