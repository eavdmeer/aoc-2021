const fs = require ('fs');
const Card = require ('./card');

function pickWinner(filename, callback)
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
      .split('\n')
      .filter(v => v != '')
      .map(v => v.trim().split(/,|\s+/).map(v => parseInt(v, 10)))
    ;

    // First line are the numbers
    const numbers = data.shift();

    // Create all cards from the other lines
    let cards = [];
    for(let i = 0; i < data.length; i += 5)
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

    callback(null, winners.pop());
  });
}

pickWinner('test.txt', (err, winner) =>
{
  if (err)
  {
    console.error(err.message);
    return;
  }
  if (winner.winningNumber !== 13 || winner.score() !== 148)
  {
    console.error('Test failed!');
    return;
  }
  else
  {
    console.log('Test case succeeded');
  }

  pickWinner('input4.txt', (err, winner) =>
  {
    if (err)
    {
      console.error(err.message);
      return;
    }
    const number = winner.winningNumber;

    console.log('winner:', winner.rows);
    console.log('winning number:', number, 'score:', winner.score(),
      'multiplied:', number * winner.score());
  });
});
