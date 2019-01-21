const moment = require('dayjs');
let a = '2019.01(上)'
let o =a.split('(')
console.log(o[1].substring(0,1))
let time = o[0].replace('.',"")
let x  = new Date()
// time = '201901'
// times = moment().year('201901')

//console.log(moment(moment(times).date(15)).format())
//console.log( moment(times.date(15)).format())
console.log( moment(x).valueOf())

// let ooo ={
//     amount:AchievementsBonuse.amount,
//     createdAt:1547518962553
// }
// console.log(isRightToday)
//await mongodb.update('achievement', { _id: ObjectId(isRightToday.id)}, { $set: ooo })