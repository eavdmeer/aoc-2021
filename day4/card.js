function Card(rows)
{
  this.rows = rows;
  this.rowMatches = Array.from(rows);
  this.colMatches = this.transpose(rows);
  this.winningNumber = -1;
}
Card.prototype.transpose = function(rows)
{
  const [ row ] = rows;
  return row.map((value, column) => rows.map(row => row[column]));
};
Card.prototype.place = function(number)
{
  this.rowMatches.forEach((r, i) =>
    this.rowMatches[i] = r.filter(v => v !== number));

  this.colMatches.forEach((r, i) =>
    this.colMatches[i] = r.filter(v => v !== number));

  return this.rowMatches.some(v => v.length == 0) ||
    this.colMatches.some(v => v.length == 0);
};
Card.prototype.score = function()
{
  return this.rowMatches
    .reduce((a, r) => a + r.reduce((n, v) => n + v, 0), 0);
};
Card.prototype.has = function(number)
{
  return this.rows.some(r => r.includes(number));
};

module.exports = Card;
