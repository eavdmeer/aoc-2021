import * as fs from 'fs/promises';
import makeDebug from 'debug';
import Card from './card.js';

const debug = makeDebug('day04');

if (process.argv[2])
{
  day04(process.argv[2]).then(console.log);
}

function solve1(data)
{
  // First line are the numbers
  const numbers = data[0];

  // Create all cards from the other lines
  const cards = [];
  for(let i = 1; i < data.length; i += 5)
  {
    cards.push(new Card(data.slice(i, i + 5)));
  }

  // Place each number and look for a winner
  let best = 0;
  numbers.some(number =>
  {
    const winner = cards.find(c => c.place(number));
    if (winner)
    {
      debug('winner:', winner.rows);
      debug('winning number:', number, 'score:', winner.score(),
        'multiplied:', number * winner.score());
      best = number * winner.score();
      return true;
    }
    return false;
  });

  return best;
}

function solve2(data)
{
  // First line are the numbers
  const numbers = data[0];

  // Create all cards from the other lines
  let cards = [];
  for(let i = 1; i < data.length; i += 5)
  {
    cards.push(new Card(data.slice(i, i + 5)));
  }

  const winners = [];
  numbers.forEach(number =>
  {
    cards
      .filter(c => c.place(number))
      .forEach(c =>
      {
        c.winningNumber = number;
        winners.push(c);
      });

    cards = cards.filter(c => ! c.place(number));
  });

  const winner = winners.pop();
  const number = winner.winningNumber;

  debug('winner:', winner.rows);
  debug('winning number:', number, 'score:', winner.score(),
    'multiplied:', number * winner.score());

  return number * winner.score();
}

export default async function day04(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.trim().split(/,|\s+/).map(v => parseInt(v, 10)));
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 4512)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 4512`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 1924)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 1924`);
  }

  return { day: 4, part1, part2, duration: Date.now() - start };
}
