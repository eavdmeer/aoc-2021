const fs = require('fs');
const process = require('process');

const doDebug = process.argv.some(v => v === '-d');


function debug(...args)
{
  if (doDebug) { console.log(...args); }
}

function xPositions(speed, max)
{
  const result = [];
  let v = speed;
  for (let p = v; p <= max; p += v--)
  {
    result.push(p);
    if (v === 0) { break; }
  }
  return result;
}

function step(pos, vel)
{
  /*
    x position increases by its x velocity.
    y position increases by its y velocity.
    x velocity changes by 1 toward the value 0;
      it decreases by 1 if it is greater than 0,
      increases by 1 if it is less than 0,
      or does not change if it is already 0.
    y velocity decreases by 1.
  */
  pos.x += vel.x;
  pos.y += vel.y;
  vel.x += vel.x === 0 ? 0 : vel.x > 0 ? -1 : 1;
  vel.y--;
}

function within(area, pos)
{
  return pos.x >= area.xMin &&
    pos.x <= area.xMax &&
    pos.y >= area.yMin &&
    pos.y <= area.yMax;
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
      .match(/^target area: x=(.+)\.\.(.+), y=(.+)\.\.(.+)$/);

    // Sanity check on the data
    if (data.slice(1, 4).some(v => ! /^[0-9-]+$/.test(v)))
    {
      callback(new Error('Error reading data!'));
      return;
    }

    // Clean up regex match output
    data.shift();
    delete data.index;
    delete data.input;
    delete data.groups;

    debug(data);

    const target = {
      xMin: Math.min(...data.slice(0, 2)),
      xMax: Math.max(...data.slice(0, 2)),
      yMin: Math.min(...data.slice(2, 4)),
      yMax: Math.max(...data.slice(2, 4))
    };
    debug(target);

    // Calculate the minimum x-speed required to reach the target
    let vMin = 0,
      xMax = 0;
    do
    {
      vMin++;
      xMax += vMin;
      debug('vMin:', vMin, 'xMax', xMax);
    } while (xMax < target.xMin);
    debug('minimum speed:', vMin);

    // Find all x-speeds that will land inside the target
    const xSpeeds = [];
    for (let v = vMin; v <= target.xMax; v++)
    {
      if (xPositions(v, target.xMax)
        .some(x => within(target, { x, y: target.yMin })))
      {
        xSpeeds.push(v);
      }
    }
    debug('xSpeeds:', xSpeeds);

    const heights = [];

    xSpeeds.forEach(vx =>
    {
      for (let vy = 0; vy < 900; vy++)
      {
        const path = [];
        debug('vx:', vx, 'vy:', vy);
        const pos = { x: 0, y: 0 };
        const vel = { x: vx, y: vy };
        path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
        while (pos.x < target.xMax && pos.y > target.yMin)
        {
          step(pos, vel);
          path.push({ x: pos.x, y: pos.y, vx: vel.x, vy: vel.y });
          if (within(target, pos))
          {
            debug(path);
            debug('bullseye!', pos, 'vel:', { vx, vy });
            heights.push(Math.max(...Object.values(path).map(v => v.y)));
            break;
          }
        }
      }
    });
    debug('heights:', heights);

    callback(null, Math.max(...heights));
  });
}

solve('test17.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 45)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input17.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('maximum height reached:', answer2);
  });
});
