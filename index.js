import day01 from './day01/index.js';
import day02 from './day02/index.js';
import day03 from './day03/index.js';
import day04 from './day04/index.js';
import day05 from './day05/index.js';
import day06 from './day06/index.js';
import day07 from './day07/index.js';
import day08 from './day08/index.js';
import day09 from './day09/index.js';
import day10 from './day10/index.js';
import day11 from './day11/index.js';
import day12 from './day12/index.js';
import day13 from './day13/index.js';
import day14 from './day14/index.js';
import day15 from './day15/index.js';
import day16 from './day16/index.js';
import day17 from './day17/index.js';
import day18 from './day18/index.js';
import day19 from './day19/index.js';
import day20 from './day20/index.js';
import day21 from './day21/index.js';
import day22 from './day22/index.js';
import day23 from './day23/index.js';
import day24 from './day24/index.js';
import day25 from './day25/index.js';

async function getResults()
{
  const report = v =>
  {
    console.log(
      `day ${String(v.day).padStart(2, 0)} solved in ${v.duration} ms`);
    return v;
  };
  const result = [
    await day01('day01/data.txt').then(report),
    await day02('day02/data.txt').then(report),
    await day03('day03/data.txt').then(report),
    await day04('day04/data.txt').then(report),
    await day05('day05/data.txt').then(report),
    await day06('day06/data.txt').then(report),
    await day07('day07/data.txt').then(report),
    await day08('day08/data.txt').then(report),
    await day09('day09/data.txt').then(report),
    await day10('day10/data.txt').then(report),
    await day11('day11/data.txt').then(report),
    await day12('day12/data.txt').then(report),
    await day13('day13/data.txt').then(report),
    await day14('day14/data.txt').then(report),
    await day15('day15/data.txt').then(report),
    await day16('day16/data.txt').then(report),
    await day17('day17/data.txt').then(report),
    await day18('day18/data.txt').then(report),
    await day19('day19/data.txt').then(report),
    await day20('day20/data.txt').then(report),
    await day21('day21/data.txt').then(report),
    await day22('day22/data.txt').then(report),
    await day23('day23/data.txt').then(report),
    await day24('day24/data.txt').then(report),
    await day25('day25/data.txt').then(report)
  ];
  return result.sort((a, b) => a.day - b.day);
}

const start = Date.now();

getResults()
  .then(res =>
  {
    console.log(res);
    console.log(`Total duration: ${Date.now() - start}ms`);
  });

