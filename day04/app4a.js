const fs = require ('fs');
const Card = require ('./card');

fs.readFile('input4.txt', (err, content) =>
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
    .filter(v => v != '')
    .map(v => v.trim().split(/,|\s+/).map(v => parseInt(v, 10)))
  ;

  // First line are the numbers
  const numbers = data.shift();

  // Create all cards from the other lines
  const cards = [];
  for(let i = 0; i < data.length; i += 5)
  {
    cards.push(new Card(data.slice(i, i + 5)));
  }

  // Place each number and look for a winner
  numbers.some(number =>
  {
    const winner = cards.find(c => c.place(number));
    if (winner)
    {
      console.log('winner:', winner.rows);
      console.log('winning number:', number, 'score:', winner.score(),
        'multiplied:', number * winner.score());
      return true;
    }
    return false;
  });
});
