import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day10');

if (process.argv[2])
{
  day10(process.argv[2]).then(console.log);
}

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
  debug('syntaxcheck:', code);
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
    debug('missing', badChar, 'in', code);
    return score[badChar];
  }

  return 0;
}

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

function solve1(data)
{
  const scores = data.map(d => syntaxCheck(d), 0);

  return scores.reduce((a, v) => a + v, 0);
}

function solve2(data)
{
  const scores = data
    .map(d => syntaxFix(d))
    .filter(d => d !== 0)
    .sort((a, b) => a - b);

  return scores[Math.floor(scores.length / 2)];
}

export default async function day10(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  /* eslint-disable no-shadow */
  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);
  /* eslint-enable no-shadow */

  debug('data', data);

  const part1 = solve1(data);
  if (target.includes('example') && part1 !== 26397)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; 26397`);
  }

  const part2 = solve2(data);
  if (target.includes('example') && part2 !== 288957)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; 288957`);
  }

  return { day: 10, part1, part2, duration: Date.now() - start };
}
