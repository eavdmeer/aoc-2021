const fs = require('fs');

function SyntaxError(message, char)
{
  this.message = message;
  this.char = char;
}
SyntaxError.prototype.toString = function()
{
  return `${this.message}: '${this.char}'!`;
};

function syntaxFix(code, verbose = false)
{
  const score = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  };
  const expectations = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'
  };
  const expect = [];

  // Filter out all corrupt lines by returning 0 for them
  const badChar = code.split('').find(ch =>
  {
    switch (ch)
    {
      case '(':
      case '[':
      case '{':
      case '<':
        expect.push(expectations[ch]);
        break;
      case expect[expect.length - 1]:
        expect.pop();
        break;
      default:
        return true;
    }
    return false;
  });
  if (badChar)
  {
    return 0;
  }

  expect.reverse();

  if (verbose)
  {
    console.log(`${code} - Complete by adding ${expect.join('')}`);
  }

  /*
  Start with a total score of 0. Then, for each character, multiply the
  total score by 5 and then increase the total score by the point value
  given for the character in the following table:
  */

  return expect.reduce((a, v) => 5 * a + score[v], 0);
}

function solve(filename, callback, verbose)
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
      .split(/\n/);

    // Sanity check on the data
    if (data.some(v => ! /^[[\]{}()<>]+$/.test(v)))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    const scores = data
      .map(d => syntaxFix(d, verbose))
      .filter(d => d !== 0)
      .sort((a, b) => a - b);

    callback(null, scores[Math.floor(scores.length / 2)]);
  });
}

// Test syntax fix
/*
const testCases = {
  good: [
    '()',
    '{()()()}',
    '(((())))',
    '<([]){()}[{}]>'
  ],
  bad: [
    '(]',
    '{()()()>',
    '(((()))}',
    '<([]){()}[{}])'
  ]
};
if (testCases.good.some(v => syntaxFix(v) > 0))
{
  throw new Error('Syntax check good test cases failed!');
}
if (testCases.bad.some(v => syntaxFix(v) === 0))
{
  throw new Error('Syntax check bad test cases failed!');
}
*/

solve('test10.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 288957)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input10.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('syntax error score:', answer2);
  });
}, true);
