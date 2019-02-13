const moment = require('dayjs');
let a = '2019.01(上)'
let o =a.split('(')
time = ['201904','上)']
let timeGo1 =   moment(time[0]).startOf('month').format()
        let timeEnd1 =   moment(time[0]).startOf('month').add(15, 'day').format()
        let timeGo2 =   moment(time[0]).startOf('month').add(15, 'day').format()
        let timeEnd2 =   moment(time[0]).endOf('month').format()
console.log(timeGo1,timeEnd1,'/n/n/n',timeGo2,timeEnd2)
// let ooo ={
//     amount:AchievementsBonuse.amount,
//     createdAt:1547518962553
// }
// console.log(isRightToday)
//await mongodb.update('achievement', { _id: ObjectId(isRightToday.id)}, { $set: ooo })