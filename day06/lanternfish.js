/*
  - Each day, its internal timer counts down by 1
  - After another day, its internal timer would become 0.
  - If the timer reaches -1, it is reset to 6, and it would
    create a new lanternfish with an internal timer of 8.
*/
function LanternFish(timerVal = 8)
{
  this.timer = timerVal;
}
LanternFish.prototype.liveOneDay = function()
{
  this.timer--;
  if (this.timer < 0)
  {
    this.timer = 6;
    return new LanternFish();
  }
  return null;
};

module.exports = LanternFish;
