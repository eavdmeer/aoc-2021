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

function syntaxCheck(code)
{
  console.log('syntaxcheck:', code);
  const score = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  };
  const expectations = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'
  };
  const expect = [];

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
    console.log('missing', badChar, 'in', code);
    return score[badChar];
  }

  return 0;
}

function solve(filename, callback)
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

    const scores = data.map(d => syntaxCheck(d), 0);

    callback(null, scores.reduce((a, v) => a + v, 0));
  });
}

// Test syntax check
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
if (testCases.good.some(v => syntaxCheck(v) > 0))
{
  throw new Error('Syntax check good test cases failed!');
}
if (testCases.bad.some(v => syntaxCheck(v) === 0))
{
  throw new Error('Syntax check bad test cases failed!');
}
console.log('Good/bad syntax test succeeded');

solve('test10.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 26397)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }
  return;

  solve('input10.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('syntax error score:', answer2);
  });
});
