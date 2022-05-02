/**
 * 
 * @param {number} currentValue 
 * @param {number} maxValue 
 * @param {number} size 
 * @returns A progress bar
 */
module.exports.generateProgressBar = function(currentValue, maxValue, size) {
  let barArray = [];

  let fill = Math.round(size * (currentValue / maxValue > 1 ? 1 : currentValue / maxValue));
  let empty = size - fill > 0 ? size - fill : 0;

  for (let i = 1; i <= fill; i++) barArray.push("▰");
  for (let i = 1; i <= empty; i++) barArray.push("▱");

  barArray[0] = barArray[0] == "▰" ? "▰" : "▱";
  barArray[barArray.length -1] = barArray[barArray.length -1] == "▰" ? "▰" : "▱";

  return barArray.join(``);
}
