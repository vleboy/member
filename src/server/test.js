 const moment = require('dayjs');

// let a = '2019.01(上)'
// let o =a.split('(')
// time = ['201904','上)']
// let timeGo1 =   moment(time[0]).startOf('month').format()
//         let timeEnd1 =   moment(time[0]).startOf('month').add(15, 'day').format()
//         let timeGo2 =   moment(time[0]).startOf('month').add(15, 'day').format()
// var dateNow = new Date()
//          let timeEnd =   moment(dateNow).endOf('month').toDate()
//          console.log(timeEnd)

// var cron = require('node-cron');

// cron.schedule('0 0 1 * *', () => {
//   console.log('Runing a job at 01:00 at America/Sao_Paulo timezone');
// }, {
//   scheduled: true,
//   timezone: "Asia/Chongqing"
// });

let ss = moment().subtract(1,'day').startOf('month').add(15, 'day').format()
console.log(moment().format())
console.log(ss)