
/////// some data

const constants = {
  enhanceTable: {
    weapon: [
      // https://i.imgur.com/G7Aw641.png
      // base %, %/fs, max %
      [1.00, .0000, 1.000],  // 1
      [1.00, .0000, 1.000],  // 2
      [1.00, .0000, 1.000],  // 3
      [1.00, .0000, 1.000],  // 4
      [1.00, .0000, 1.000],  // 5
      [1.00, .0000, 1.000],  // 6
      [1.00, .0000, 1.000],  // 7
      [.200, .0250, .5250],  // 8
      [.175, .0200, .4550],  // 9
      [.150, .0150, .3750],  // 10
      [.125, .0125, .3250],  // 11
      [.100, .0075, .2350],  // 12
      [.075, .0063, .2000],  // 13
      [.050, .0050, .1750],  // 14
      [.025, .0050, .1500],  // 15
      [.150, .0150, .5250],  // 16 PRI
      [.075, .0075, .3375],  // 17 DUO
      [.050, .0050, .2700],  // 18 TRI
      [.020, .0025, .2500],  // 19 TET
      [.015, .0015, .2010],  // 20 PEN
    ]
  }
};

/////// wire things up

function ViewModel() {
  this.blackstones = ko.observable(0);
  this.failstacks = ko.observable(0);
  this.blackstonesPrice = ko.observable(300000);
  this.enhanceType = ko.observable('weapon');
  this.currentLevel = ko.observable(0);
  this.desiredLevel = ko.observable(15);

  this.totalAverageStones = ko.computed(() =>
    numberStones(this.enhanceType(), this.currentLevel(), this.desiredLevel(), this.failstacks())
  );
  this.numStonesToBuy = ko.computed(() =>
    Math.ceil(this.totalAverageStones() - this.blackstones())
  );
  this.totalCost = ko.computed(() =>
    Math.ceil(this.numStonesToBuy() * this.blackstonesPrice())
  );
};

ko.applyBindings(new ViewModel());


/////// some math

function infoForLevel(type, level) {
  return constants.enhanceTable[type][clamp(level, 1, 20) -1];
}

function chanceAtLevel(type, level, stacks) {
  const [base, per, max] = infoForLevel(type, level);
  const maxStacks = base === 1 ? stacks : (max - base) / per;
  stacks = clamp(stacks, 0, maxStacks);
  return base + per * stacks;
}

function expectedStonesForLevel(type, level, stacks) {
  const chance = chanceAtLevel(type, level, stacks);
  return 1 / chance;
}

function numberStones(type, start, finish, stacks) {
  let n = 0;
  for (let level = start; level < finish; level++) {
    n += expectedStonesForLevel(type, level+1, stacks);
    // stacks reset on success
    stacks = 0;
  }
  return n;
}

/////// some utilities

// returns min if x < min, max if x > max, otherwise x
function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}
