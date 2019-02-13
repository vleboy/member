const moment = require('dayjs');
const _ = require('lodash')

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

    //nowDate = moment().daysInMonth(); nowHour = 23; nowMinute = 58;
    let isSettlemented = false
    console.log(nowDate)
    //判断当前时间是否在结算期内
    if (
        ((nowDate == 15 && nowHour == 23 && nowMinute > 57)) || //第一期
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

            if (nowDate == 15) { //当月第一期
                achievements = await mongodb.find('achievement', { createdAt: { '$lte': nowTime.valueOf(), '$gt': moment().startOf('month').valueOf() } })
                period = 1
            } else { //当月第二期
                achievements = await mongodb.find('achievements', { createdAt: { '$gt': moment().startOf('month').add(15, 'day').valueOf(), '$lte': nowTime.valueOf() } })
                //achievements = await mongodb.find('achievement') 
                period = 2
            }
            // console.log(achievements)
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

            // let pushBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month()+1}月,第${period}期奖励`, project: '当期结算' }
            //市场奖结算
            let marketBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month() + 1}月,第${period}期市场奖奖励`, project: '市场奖' }
            let leaderBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month() + 1}月,第${period}期领导奖奖励`, project: '领导奖' }
            let achieveUser = []//获得市场奖的用户
            let pushMarketBillTems = []//市场奖写入模板集合
            let pushLeaderBillTems = []//领导奖写入模板集合
            let PushleaderBonuseTems = []//领导奖写入业绩
            //奖获得市场奖的用户筛选出来
            achievements.map(item => {
                if (achieveUser.indexOf(item.userId) == -1 && item.project == '市场奖') {
                    achieveUser.push(item.userId)
                }
            })

            achieveUser.map(async item => {
                let userBillTemp = _.cloneDeep(marketBillTem)
                let r = _.filter(achievements, _.iteratee(['userId', item]));
                let userBill = 0;
                r.map((i) => {
                    userBill = Math.abs(i.amount) + userBill
                })
                userBill = userBill / 2
                pushMarketBillTems.amount = userBill
                pushMarketBillTems.userId = item
                pushMarketBillTems.push(userBillTemp)

                //结算领导奖
                
                let r1 = await mongodb.find('user', { id: item })
                let leader = r1[0].recommendIndex.reverse()
                let leaderLevel1Bonuse = userBill * 0.50
                let leaderLevel2Bonuse = userBill * 0.20
                let leaderLevel3Bonuse = userBill * 0.10
                if (leader[1]) {
                    console.log(`【${leader[1]}】获得领导奖【${leaderLevel1Bonuse}】`)
                    let le = _.cloneDeep(leaderBillTem)
                    le.userId = leader[1]
                    le.amount = leaderLevel1Bonuse
                    pushLeaderBillTems.push(le)                         
                }
                if (leader[2]) {
                    console.log(`【${leader[2]}】获得领导奖【${leaderLevel2Bonuse}】`)
                    let le = _.cloneDeep(leaderBillTem)
                    le.userId = leader[2]
                    le.amount = leaderLevel1Bonuse
                    pushLeaderBillTems.push(le)                         
                }
                if (leader[3]) {
                    console.log(`【${leader[3]}】获得领导奖【${leaderLevel3Bonuse}】`)
                    let le = _.cloneDeep(leaderBillTem)
                    le.userId = leader[3]
                    le.amount = leaderLevel3Bonuse
                    pushLeaderBillTems.push(le)                         
                }

            })
            //写入市场奖数据库
            pushMarketBillTems.map(async (item) => {
                console.log('item', item)
                await mongodb.insert('bill', item)//插入账单
                await mongodb.update('user', { id: item.userId }, { $inc: { balance: item.amount } })//更新余额

            })
            
            pushLeaderBillTems.map(async (item) => {
                console.log('item', item)
                await mongodb.insert('bill', item)//插入账单
                await mongodb.update('user', { id: item.userId }, { $inc: { balance: item.amount } })//更新余额
                

            })
            //结算领导奖
            let leaderBonuse = { userId: '', project: '领导奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '领导奖' }
           let LeaderAchievement = []
           
            pushLeaderBillTems.map( (item) => {
                let leaderBonuseTem = _.cloneDeep(leaderBonuse)
               let i = 0
                LeaderAchievement.forEach(element => {
                    if(item.userId == element.userId){
                        i = 1
                        element.amount = item.amount + element.amount
                    }
                });
                if(i == 0){
                    leaderBonuseTem.amount = item.amount
                    leaderBonuseTem.userId = item.userId
                    LeaderAchievement.push(leaderBonuseTem)
                }                
            })


          LeaderAchievement.map(async item =>{
            console.log('item', item)
            await mongodb.insert('achievement', item)//插入业绩表
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



