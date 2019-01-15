const moment = require('dayjs');
const _ =require('lodash')

// console.log(moment().startOf('month').valueOf())
// console.log(moment(moment().date('15')).startOf('day').format())
let isSettlemented = false
async function settlement() {
    //console.log('系统结算检查')
    //第一期结算
    //获取当前时间
   let nowTime = moment()
    let nowDate = nowTime.date()
    let nowHour = nowTime.hour()
    let nowMinute = nowTime.minute()

    // nowDate = 14; nowHour = 23; nowMinute = 58;
    // let isSettlemented = false

    //判断当前时间是否在结算期内
    if (
        ((nowDate == 14 && nowHour == 23 && nowMinute > 57)) || //第一期
        ((nowDate == moment().daysInMonth() && nowHour == 23 && nowMinute > 57)//第二期
        )
    ) {
        //判断当期结算标记是否为已结算
        if (isSettlemented == false) {
            //结算标记为未结算，执行结算逻辑
            isSettlemented = true
            let achievements = null
            let period = 0;
            //将当期结算抽取出来
            if (nowDate == 14) { //当月第一期
                achievements = await mongodb.find('achievements', { createdAt: { '$lte': nowTime.valueOf(), '$gt': moment().startOf('month').valueOf() } })
                period = 1
            } else { //当月第二期
                achievements = await mongodb.find('achievements', { createdAt: { '$gt': moment().startOf('month').add(14, 'day').valueOf(), '$lte': nowTime.valueOf() } })
                period = 2
            }
            //将结果保存在achievements数组中
            //通过achievements数组，找出相应的User并处理其金额
            //debug
            // achievements = [{
            //     _id: '5c38538d0327214c839a9ced', userId: "root", type: "IN", amount: 1001, createdAt: 1547195277650, remark: "D961449", project: "推荐奖"
            // }, {
            //     _id: '5c38538d0327214c839a9ce2', userId: "root", type: "IN", amount: 2000, createdAt: 1547195277650, remark: "D961449", project: "推荐奖"
            // },{
            //     _id: '5c38538d0327214c839a5ce2', userId: "root1", type: "IN", amount: 3002, createdAt: 1547195277650, remark: "D961449", project: "推荐奖"
            // },{
            //     _id: '5c38538d0327214c839a9ce2', userId: "root2", type: "IN", amount: 4003, createdAt: 1547195277650, remark: "D961449", project: "推荐奖"
            // }]

           let pushBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month()}月,第${period}期奖励`, project: '当期结算' }

            let achieveUser = []
            let pushBillTems = []
            achievements.map(item => {
                if (achieveUser.indexOf(item.userId) == -1) {
                    achieveUser.push(item.userId)
                }
            })
            
            achieveUser.map((item) => {
                let userBillTemp = _.cloneDeep(pushBillTem)
                let r = _.filter(achievements, _.iteratee(['userId', item]));
                let userBill = 0;
                r.map((i) => {
                    userBill = i.amount + userBill
                })
                userBillTemp.amount = userBill
                userBillTemp.userId = item
                pushBillTems.push(userBillTemp)
            })
          
            pushBillTems.map(async (item) => {
                console.log('item',item)
                await mongodb.insert('bill', item)
            })

           
        } else {
            console.log('系统正在结算中')
        }
    } else {
        //不在结算期内
        //将结算标志标记为未结算
        //console.log('不在结算期，结束返回')
        if (isSettlemented == true) {
            isSettlemented = false
        }

    }

}

module.exports = settlement



