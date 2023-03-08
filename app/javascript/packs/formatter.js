window.roundNumber = function roundNumber(num, roundNum=4) {
  BigNumber.set({ DECIMAL_PLACES: roundNum, ROUNDING_MODE: 1 })
  var decVal = new BigNumber(num)
  return decVal.toFixed(roundNum)
}

window.roundNumberOne = function roundNumberOne(num, roundNum=4) {
  var decVal = new BigNumber(num)
  return decVal.toFixed(roundNum)
}

window.mergeAmountSymbol = function mergeAmount(num, symbol) {
  // var finalNum = roundNumber(num)
  // return finalNum + ' ' + symbol
  return num + ' ' + symbol
}

window.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(one, two) {
  var numOne = BigNumber(one)
  return numOne.isGreaterThanOrEqualTo(BigNumber(two))
}

window.numToString = function numToString(num) {
  var numOne = BigNumber(num)
  return numOne.toString()
}

window.percentageOf = function percentageOf(ofPercent, inNum, roundNum=4) {
  var numOne = BigNumber(inNum)
  // return numOne.multipliedBy(ofPercent).dividedBy(100).toFixed(roundNum)
  // return numOne.multipliedBy(ofPercent).dividedBy(100)
  return (numOne.multipliedBy(BigNumber(ofPercent)))/100
}

window.multipliedBy = function multipliedBy(one, two, roundNum=4) {
  var numOne = BigNumber(one)
  // return numOne.multipliedBy(two).toFixed(roundNum)
  return numOne.multipliedBy(two)
}

window.plusNum = function plusNum(one, two, roundNum=4) {
  var numOne = BigNumber(one)
  // return numOne.plus(two).toFixed(roundNum)
  return numOne.plus(two)
}

window.minusNum = function minusNum(one, two) {
  var numOne = BigNumber(one)
  return numOne.minus(two)
}

window.isEqualTo = function isEqualTo(one, two) {
  return BigNumber(one).isEqualTo(BigNumber(two))
}

window.isLessThanOrEqualTo = function isLessThanOrEqualTo(one, two) {
  return BigNumber(one).isLessThanOrEqualTo(BigNumber(two))
}

// CHECK FOR NON NEGATIVE AND GREATER THAN ZERO
window.validNum = function validNum(num) {
  var numOne = BigNumber(num)
  return numOne.isInteger(num) && numOne.isGreaterThan(0)
}

window.validFloat = function validFloat(num) {
  var numOne = BigNumber(num)
  return numOne.isPositive() && numOne.isGreaterThan(0)
}

window.toNum = function toNum(num) {
  return BigNumber(num).toNumber()
}

window.mulBy = function mulBy(one, two) {
  return BigNumber(one).multipliedBy(two)
}

window.divBy = function divBy(one, two) {
  return BigNumber(one).dividedBy(two)
}
