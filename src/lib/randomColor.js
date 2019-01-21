const randomColorFactor = require('./randomColorFactor')

module.exports = function(opacity) {
  return 'rgba(' +   Math.round(Math.round(randomColorFactor()/2) + 10) + ',' + Math.round(Math.round(randomColorFactor()/6) + 100) + ',' + Math.round( Math.round(randomColorFactor()/7) + 200) + ',' + (opacity || '.3') + ')'
}