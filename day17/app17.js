const fs = require('fs');
const process = require('process');

const doDebug = process.argv.some(v => v === '-d');

let versionSum = 0;

function debug(...args)
{
  if (doDebug) { console.log(...args); }
}

function decodeLiteral(bits)
{
  /*
   110 100 101111111000101 000
   VVV TTT AAAAABBBBBCCCCC PPP

   V (110): packet version, 6.
   T (100): packet type ID, 4 (literal value)
   Followed by three groups of 5 bits A (10111), B (11110) C (00101)
   The first bit of the 5 bits groups indicates the last group (0)

   P Three trailing bits align things on a 8 bit boundary
  */

  debug('decoding literal');

  let moreData = '',
    value = '';
  do
  {
    const nibble = bits.splice(0, 5);
    moreData = nibble.shift();
    debug('nibble:', nibble);
    debug('moreData:', moreData);
    value += nibble.join('');
  } while (moreData === '1');

  return parseInt(value, 2);
}

function decodeOperator(bits)
{
  /*
   For example, here is an operator packet (hexadecimal string
   38006F45291200 with length type ID 0 that contains two sub-packets:

   001 110 0 000000000011011 11010001010 0101001000100100 0000000
   VVV TTT I LLLLLLLLLLLLLLL AAAAAAAAAAA BBBBBBBBBBBBBBBB PPPPPPP

   V (110): packet version, 6.
   T (100): packet type ID, 4 (literal value)
   I (0) is the length type ID (0 = 15 bits, 1 = 11 bits)
   L (000000000011011) 15 bits length of subpackets: 27 bits.
   A 11 bits literal value packet representing the number 10.
   B 16 bits literal value representing the number 20.
   P 7 bits of padding to align to 8 bits

   This reads 11 + 16 = 27 bits of sub-packet data

   As another example, here is an operator packet (hexadecimal string
   EE00D40C823060 with length type ID 1 that contains three sub-packets:

   111 011 1 00000000011 01010000001 10010000010 00110000011 00000
   VVV TTT I LLLLLLLLLLL AAAAAAAAAAA BBBBBBBBBBB CCCCCCCCCCC PPPPP

   V (110): packet version, 6.
   T (100): packet type ID, 4 (literal value)
   I (1) is the length type ID (0 = 15 bits, 1 = 11 bits)
   L (00000000011) number of subpackets: 3.
   A 11 bits literal value packet representing the number 1.
   B 11 bits literal value representing the number 2.
   C 11 bits literal value representing the number 3.
   P 5 bits of padding to align to 8 bits
   */

  debug('decoding operator');

  let value = [];

  const sizeType = bits.splice(0, 1).join('');
  debug('size type:', sizeType);
  const size = parseInt(
    bits.splice(0, sizeType === '0' ? 15 : 11).join(''),
    2);

  debug('size:', sizeType === '0' ? 15 : 11, 'bits',
    `(${size} ${sizeType === '0' ? 'bits' : 'packets'})`);

  if (sizeType === '0')
  {
    debug('decoding block');
    value = decode(bits.splice(0, size), false);
  }
  else
  {
    debug('decoding individually');
    for (let i = 0; i < size; i++)
    {
      value.push(decode(bits, false, true)[0]);
    }
  }

  return value;
}

function decode(bits, align = true, single = false)
{
  debug('decoding message', align ? '(aligned)' : '',
    single ? '(single)' : '');
  debug(bits);

  const packets = [];

  while (bits.length > 0)
  {
    const version = parseInt(bits.splice(0, 3).join(''), 2);
    debug('version:', version);
    versionSum += version;
    const type = parseInt(bits.splice(0, 3).join(''), 2);
    debug('type:', type);

    const packet = { version, type };
    packets.push(packet);

    switch (type)
    {
      case 4:
        packet.value = decodeLiteral(bits);
        debug('decoded literal:', packet);
        break;
      default:
        packet.value = decodeOperator(bits);
    }

    if (align)
    {
      debug('aligning', bits.length, 'remaining bits');
    }
    if (align && bits.length % 8 > 0)
    {
      // consume padding zeros for 8-bit alignment
      const padding = bits.splice(0, bits.length % 8);
      debug('padding:', padding);
      if (padding.some(v => v !== '0'))
      {
        throw new Error('Parse error in padding!');
      }
    }

    debug('leftover bits:', bits);

    // Stop if we're instructed to process a single packet only
    if (single) { break; }
  }

  return packets;
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
      .split('');

    // Sanity check on the data
    if (data.some(v => ! /^[0-9A-F]$/.test(v)))
    {
      callback(new Error('Error reading data!'));
      return;
    }
    debug(data);

    const bits = [];
    data.forEach(ch =>
    {
      bits.push(
        ...parseInt(ch, 16).toString(2).padStart(4, '0').split('')
      );
    });

    debug(bits);

    /*
    console.log('==== LITERAL value');
    console.log(decode('110100101111111000101000'.split('')));

    console.log('==== OPERATOR value');
    const test = [
     '11101110000000001101010000001100100000100011000001100000',
     '00111000000000000110111101000101001010010001001000000000'
    ];
    test.forEach(t =>
     console.log(JSON.stringify(decode(t.split('')), null, 2)));
    */

    versionSum = 0;
    console.log(JSON.stringify(decode(bits), null, 2));

    callback(null, versionSum);
  });
}

solve('test16.txt', (err, answer) =>
{
  if (err)
  {
    throw err;
  }

  if (answer === 31)
  {
    console.log('Test case succeeded');
  }
  else
  {
    console.error(`Test case failed (${answer})!`);
    return;
  }

  solve('input16.txt', (err, answer2) =>
  {
    if (err)
    {
      throw err;
    }
    console.log('sum of all versions:', answer2);
  });
});
