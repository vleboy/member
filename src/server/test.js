const _ = require('lodash')
const achievements =[{userid:'MX1',price:300},{userid:'MX2',price:300},{userid:'MX2',price:300},{userid:'MX1',price:300},{userid:'MX1',price:300},
{userid:'MX1',price:300},{userid:'MX3',price:300},{userid:'MX3',price:300},{userid:'MX3',price:300},{userid:'MX1',price:300}
]
let r =_.filter(achievements, _.iteratee(['userid', 'MX1']));
console.log(r)