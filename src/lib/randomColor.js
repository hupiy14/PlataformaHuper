const randomColorFactor = require('./randomColorFactor')
//const randomColorAnalogo = require('./randonAnalogos')
//const randomColorOpaco = require('./randonColorOpaco')

module.exports = function(opacity, stilo) {
  
  
  if(stilo === 1)
  {
    return 'rgba(214,245,8,' + (opacity || '.3') + ')'
    //return 'rgba(' +   Math.round(randomColorOpaco() + 150) + ',' + Math.round(randomColorOpaco() + 200) + ',' + Math.round(0) + ',' + (opacity || '.3') + ')'

  }

  else if(stilo === 2)
  {
    return 'rgba(221,101,18,' + (opacity || '.3') + ')'
  //  return 'rgba(' +   Math.round(255) + ',' + Math.round(randomColorAnalogo() + 150) + ',' + Math.round(51) + ',' + (opacity || '.3') + ')'

  }
  else if(stilo === 3)
  {
    return 'rgba(143,125,211,' + (opacity || '.3') + ')'
    // return 'rgba(' +   Math.round(Math.round(randomColorFactor()/2) + 20) + ',' + Math.round(Math.round(randomColorFactor()/6) + 100) + ',' + Math.round( Math.round(randomColorFactor()/7) + 200) + ',' + (opacity || '.3') + ')'

  }
  
  return 'rgba(' +   Math.round(Math.round(randomColorFactor()/2) + 10) + ',' + Math.round(Math.round(randomColorFactor()/6) + 100) + ',' + Math.round( Math.round(randomColorFactor()/7) + 200) + ',' + (opacity || '.3') + ')'

  //return 'rgba(' +   Math.round(Math.round(randomColorFactor()/2) + 10) + ',' + Math.round(Math.round(randomColorFactor()/6) + 100) + ',' + Math.round( Math.round(randomColorFactor()/7) + 200) + ',' + (opacity || '.3') + ')'


}