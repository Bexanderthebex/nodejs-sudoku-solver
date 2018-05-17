const addon = require("./build/Release/module");
const value = [
  [1, 0, 3, 0, 2, 0, 0, 0, 4],
  [0, 2, 9, 0, 0, 8, 0, 1, 0],
  [0, 0, 3, 0, 4, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 4, 0],
  [0, 0, 0, 7, 6, 9, 0, 0, 0],
  [0, 0, 6, 0, 7, 0, 8, 0, 0],
  [0, 9, 1, 0, 8, 0, 0, 7, 0],
  [8, 0, 7, 0, 3, 0, 0, 0, 6]
];
const positionsToCheck = [[0, 2], [1, 2]];
const type = 10;
console.log(`array: `, addon.checker(value, positionsToCheck, 40));
