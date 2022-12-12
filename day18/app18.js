const fs = require('fs');
const process = require('process');

const doDebug = process.argv.some(v => v === '-d');

function debug(...args)
{
  if (doDebug) { console.log(...args); }
}

function getNodes(number, parent = null, nodes = [])
{
  const [ left, right ] = number;
  const node = { parent };

  nodes.push(node);

  node.left = Array.isArray(left) ? getNodes(left, node, nodes) : left;
  node.right = Array.isArray(right) ? getNodes(right, node, nodes) : right;

  return parent ? node : nodes;
}

function updateRight(node, value, prev)
{
  if (node === null)
  {
    return;
  }

  if (node.right === prev)
  {
    updateRight(node.parent, value, node);
    return;
  }

  if (node.left === prev)
  {
    if (typeof node.right === 'object')
    {
      updateLeft(node.right, value);
      return;
    }
  }

  if (typeof node.right === 'object')
  {
    updateRight(node.right, value);
    return;
  }

  node.right += value;
}

function updateLeft(node, value, prev)
{
  if (node === null)
  {
    return;
  }

  if (node.left === prev)
  {
    updateLeft(node.parent, value, node);
    return;
  }

  if (node.right === prev)
  {
    if (typeof node.left === 'object')
    {
      updateRight(node.left, value);
      return;
    }
  }

  if (typeof node.left === 'object')
  {
    updateLeft(node.left, value);
    return;
  }

  node.left += value;
}

function split(nodes, node = null)
{
  if (!node)
  {
    return split(nodes, nodes[0]);
  }

  for (const side of [ 'left', 'right' ])
  {
    if (typeof node[side] === 'object')
    {
      const res = split(nodes, node[side]);

      if (res)
      {
        return res;
      }
    }

    if (node[side] >= 10)
    {
      const newNode = {
        parent: node,
        left: Math.floor(node[side] / 2),
        right: Math.ceil(node[side] / 2)
      };

      node[side] = newNode;
      nodes.push(newNode);

      return true;
    }
  }

  return false;
}

function explode(node, depth = 0)
{
  if (Array.isArray(node))
  {
    return explode(node[0]);
  }

  const { parent, left, right } = node;

  for (const side of [ 'left', 'right' ])
  {
    if (typeof node[side] === 'object')
    {
      const res = explode(node[side], depth + 1);

      if (res)
      {
        return res;
      }
    }
  }

  if (depth >= 4)
  {
    updateLeft(parent, left, node);
    updateRight(parent, right, node);

    /* eslint-disable-next-line no-unused-expressions */
    parent.left === node ? parent.left = 0 : parent.right = 0;

    return true;
  }

  return false;
}

function reduce(nodes)
{
  /* eslint-disable-next-line no-constant-condition */
  while (true)
  {
    if (!explode(nodes) && !split(nodes))
    {
      break;
    }
  }

  return nodes;
}

function add(nodes1, nodes2)
{
  if (! nodes1)
  {
    return nodes2;
  }
  if (! nodes2)
  {
    return nodes1;
  }
  const newParent = {
    parent: null,
    left: nodes1[0],
    right: nodes2[0]
  };

  nodes1[0].parent = newParent;
  nodes2[0].parent = newParent;

  return reduce([
    newParent,
    ...nodes1,
    ...nodes2
  ]);
}

function getMagnitude(node)
{
  if (Array.isArray(node))
  {
    return getMagnitude(node[0]);
  }

  let result = 0;

  for (const side of [ 'left', 'right' ])
  {
    const multiplier = side === 'left' ? 3 : 2;

    if (typeof node[side] === 'object')
    {
      result += multiplier * getMagnitude(node[side]);
    }
    else
    {
      result += multiplier * node[side];
    }
  }

  return result;
}

function solve(filename, part, callback)
{
  debug('starting');
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
      .map(line => JSON.parse(line));

    debug(data);

    const sum = data.reduce((a, v) => add(a, getNodes(v)), null);

    // part 1
    if (part === 1)
    {
      const magnitude = getMagnitude(sum);
      debug('total sum magnitude:', magnitude);
      callback(null, magnitude);
      return;
    }

    let maxMagnitude = 0;

    for (const a of data)
    {
      for (const b of data)
      {
        const mag = getMagnitude(add(getNodes(a), getNodes(b)));

        if (maxMagnitude < mag)
        {
          maxMagnitude = mag;
        }
      }
    }

    debug('largest sum magnitude:', maxMagnitude);

    callback(null, maxMagnitude);
  });
}

const part = process.argv.some(v => v === '-2') ? 2 : 1;

solve('test18.txt', part, (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (part === 1 && answer === 3488)
  {
    console.log('Test case succeeded');
  }
  else if (part === 2 && answer === 3946)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input18.txt', part, (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    if (part === 1)
    {
      console.log('largest sum magnitude:', answer2);
    }
    else
    {
      console.log('maximum sum magnitude:', answer2);
    }
  });
});
