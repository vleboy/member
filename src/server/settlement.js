const moment = require('dayjs');
const _ = require('lodash')

// console.log(moment().startOf('month').valueOf())
// console.log(moment(moment().date('15')).startOf('day').format())

async function settlement() {
    //console.log('系统结算检查')
    //第一期结算
    //获取当前时间
    let nowTime = moment()
    let nowDate = nowTime.date()
    let nowHour = nowTime.hour()
    let nowMinute = nowTime.minute()

    // nowDate = 15; nowHour = 23; nowMinute = 58;
    // nowTime = nowTime.date(nowDate)
    // nowTime.hour = nowHour
    // nowTime.minute = nowMinute
    // nowTime = moment('2019-02-15 23:58:58')
    let isSettlemented = false
    console.log(nowTime.format())
    //判断当前时间是否在结算期内
    if (
        ((nowDate == 16 && nowHour == 0 && nowMinute < 3)) || //第一期
        ((nowDate == 1 && nowHour == 0 && nowMinute < 3)//第二期
        )
    ) {
        //判断当期结算标记是否为已结算
        console.log('系统结算时间正常，开始结算')
        if (isSettlemented == false) {
            //结算标记为未结算，执行结算逻辑
            // isSettlemented = true
            let achievements = null
            let period = 0;
            //将当期结算抽取出来

            if (nowDate == 16) { //当月第一期
                achievements = await mongodb.find('achievement', { createdAt: { '$lte': nowTime.valueOf(), '$gt': moment().startOf('month').valueOf() } })
                period = 1
            } else { //当月第二期
              
                achievements = await mongodb.find('achievement', { createdAt: { '$gt': moment().subtract(1, 'day').startOf('month').add(15, 'day').valueOf(), '$lte': nowTime.valueOf() } })
                //achievements = await mongodb.find('achievement') 
                period = 2
            }
            //零售奖结算
            let retailBillTem = {userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `零售奖`, project: '零售奖'}
            //推荐奖结算    
            let recommendedBillTem1 = {userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `推荐奖`, project: '推荐奖'}
            let recommendedBillTem2 = {userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `回本奖`, project: '回本奖'}
            //市场奖结算
            let marketBillTem = {}
            let leaderBillTem = {}
            if (period = 1) {
                marketBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month() + 1}月,第${period}期市场奖奖励`, project: '市场奖' }
                leaderBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.month() + 1}月,第${period}期领导奖奖励`, project: '领导奖' }
            } else if (period = 2) {
                if (nowTime.month() == 1) {
                    marketBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.subtract(1,'month').month()}月,第${period}期市场奖奖励`, project: '市场奖' }
                    leaderBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.year()}年${nowTime.subtract(1,'month').month()}月,第${period}期领导奖奖励`, project: '领导奖' }

                } else {
                    marketBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.subtract(1,'year').year()}年${nowTime.subtract(1,'month').month()}月,第${period}期市场奖奖励`, project: '市场奖' }
                    leaderBillTem = { userId: null, type: 'IN', amount: 0, createdAt: nowTime.valueOf(), remark: `${nowTime.subtract(1,'year').year()}年${nowTime.subtract(1,'month').month()}月,第${period}期市场奖奖励`, project: '领导奖' }

                }
            }
            let recommendUser1 = [] //获得推荐奖用户
            let recommendUser2 = [] //获得回本奖用户
            let achieveUser = []//获得市场奖的用户 
            let retailUser = [] //获得零售奖的用户
            let pushMarketBillTems = []//市场奖写入模板集合
            let pushLeaderBillTems = []//领导奖写入模板集合
            let PushleaderBonuseTems = []//领导奖写入业绩
            //将获得零售奖的用户筛选出来
            achievements.map(item => {
                if (retailUser.indexOf(item.userId) == -1 && item.project == '零售奖' ) {
                    retailUser.push(item.userId)
                }
            })
            retailUser.map(async item =>{
                let userRetailBillTem = _.cloneDeep(retailBillTem)
                let r = _.filter(achievements, _.iteratee({ 'userId': item, 'project': '零售奖'}));
                let userBill = 0;
                r.map((i) => {
                    userBill = Math.abs(i.amount) + userBill
                })
                userRetailBillTem.amount = userBill
                userRetailBillTem.userId = item
                console.log('零售奖', userRetailBillTem)
               await mongodb.insert('bill', userRetailBillTem)//插入账单
               userRetailBillTem.type = "OUT"
                await mongodb.insert('serverBill', userRetailBillTem)//插入账单
                await mongodb.update('user', { id: userRetailBillTem.userId }, { $inc: { balance: userRetailBillTem.amount } })
            })
            //将获得推荐奖的用户筛选出来
            achievements.map(item => {
                if (recommendUser1.indexOf(item.userId) == -1 && item.project == '推荐奖' && item.remark == '第一阶段') {
                    recommendUser1.push(item.userId)
                }
            })

            recommendUser1.map(async item =>{
                let recommendBillTemp = _.cloneDeep(recommendedBillTem1)
                let r = _.filter(achievements, _.iteratee({ 'userId': item, 'project': '推荐奖' ,'remark':'第一阶段'}));
                let userBill = 0;
                r.map((i) => {
                    userBill = Math.abs(i.amount) + userBill
                })
                recommendBillTemp.amount = userBill
                recommendBillTemp.userId = item
                console.log('推荐奖', recommendBillTemp)
               await mongodb.insert('bill', recommendBillTemp)//插入账单
               recommendBillTemp.type = "OUT"
                await mongodb.insert('serverBill', recommendBillTemp)//插入账单
                await mongodb.update('user', { id: recommendBillTemp.userId }, { $inc: { balance: recommendBillTemp.amount } })
            })
            achievements.map(item => {
                if (recommendUser2.indexOf(item.userId) == -1 && item.project == '推荐奖' && item.remark == '第二阶段') {
                    recommendUser2.push(item.userId)
                }
            })
            recommendUser2.map(async item =>{
                let recommendBillTemp = _.cloneDeep(recommendedBillTem2)
                let r = _.filter(achievements, _.iteratee({ 'userId': item, 'project': '推荐奖' ,'remark':'第二阶段'}));
                let userBill = 0;
                r.map((i) => {
                    userBill = Math.abs(i.amount) + userBill
                })
                recommendBillTemp.amount = userBill
                recommendBillTemp.userId = item
                console.log('推荐奖', recommendBillTemp)
               await mongodb.insert('bill', recommendBillTemp)//插入账单
               recommendBillTemp.type = "OUT"
                await mongodb.insert('serverBill', recommendBillTemp)//插入账单
                await mongodb.update('user', { id: recommendBillTemp.userId }, { $inc: { balance: recommendBillTemp.amount } })
            })
           
            //奖获得市场奖的用户筛选出来
            achievements.map(item => {
                if (achieveUser.indexOf(item.userId) == -1 && item.project == '市场奖') {
                    achieveUser.push(item.userId)
                }
            })

                achieveUser.map(async item => {
                let userBillTemp = _.cloneDeep(marketBillTem)
                let r = _.filter(achievements, _.iteratee({ 'userId': item, 'project': '市场奖' }));
                let userBill = 0;
                r.map((i) => {
                    userBill = Math.abs(i.amount) + userBill
                })
                userBill = userBill / 2
                userBillTemp.amount = userBill
                userBillTemp.userId = item
                if (userBillTemp.amount != 0) {
                   // pushMarketBillTems.push(userBillTemp)
                   console.log('市场奖', userBillTemp)
                   await  mongodb.insert('bill', userBillTemp)//插入账单
                    userBillTemp.type = "OUT"
                    await  mongodb.insert('serverBill', userBillTemp)//插入账单
                    await mongodb.update('user', { id: userBillTemp.userId }, { $inc: { balance: userBillTemp.amount } })

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
                    //pushLeaderBillTems.push(le)
                    await   mongodb.insert('bill', le)//插入账单
                     le.type = "OUT"
                     await  mongodb.insert('serverBill', le)//插入账单
                     await  mongodb.update('user', { id: le.userId }, { $inc: { balance: le.amount } })//更新余额
                }
                if (leader[2]) {
                    console.log(`【${leader[2]}】获得领导奖【${leaderLevel2Bonuse}】`)
                    let le = _.cloneDeep(leaderBillTem)
                    le.userId = leader[2]
                    le.amount = leaderLevel2Bonuse
                   // pushLeaderBillTems.push(le)
                   await mongodb.insert('bill', le)//插入账单
                    le.type = "OUT"
                    await mongodb.insert('serverBill', le)//插入账单
                    await mongodb.update('user', { id: le.userId }, { $inc: { balance: le.amount } })//更新余额
                }
                if (leader[3]) {
                    console.log(`【${leader[3]}】获得领导奖【${leaderLevel3Bonuse}】`)
                    let le = _.cloneDeep(leaderBillTem)
                    le.userId = leader[3]
                    le.amount = leaderLevel3Bonuse
                  //  pushLeaderBillTems.push(le)
                  await mongodb.insert('bill', le)//插入账单
                   le.type = "OUT"
                   await mongodb.insert('serverBill', le)//插入账单
                   await mongodb.update('user', { id: le.userId }, { $inc: { balance: le.amount } })//更新余额
                }
            }
            })
            // //写入市场奖数据库
            // pushMarketBillTems.map(async (item) => {
            //     console.log('item', item)
            //     await mongodb.insert('bill', item)//插入账单
            //     await mongodb.update('user', { id: item.userId }, { $inc: { balance: item.amount } })//更新余额

            // })

            // pushLeaderBillTems.map(async (item) => {
            //     console.log('item', item)
            //     await mongodb.insert('bill', item)//插入账单
            //     await mongodb.update('user', { id: item.userId }, { $inc: { balance: item.amount } })//更新余额


            // })
            //结算领导奖
            // let leaderBonuse = { userId: '', project: '领导奖', type: 'IN', amount: 0, createdAt: moment(nowTime).valueOf(), remark: '领导奖' }
            // let LeaderAchievement = []

            // pushLeaderBillTems.map((item) => {
            //     let leaderBonuseTem = _.cloneDeep(leaderBonuse)
            //     let i = 0
            //     LeaderAchievement.forEach(element => {
            //         if (item.userId == element.userId) {
            //             i = 1
            //             element.amount = item.amount + element.amount
            //         }
            //     });
            //     if (i == 0) {
            //         leaderBonuseTem.amount = item.amount
            //         leaderBonuseTem.userId = item.userId
            //         LeaderAchievement.push(leaderBonuseTem)
            //     }
            // })


            // LeaderAchievement.map(async item => {
            //     console.log('item', item)
            //     await mongodb.insert('achievement', item)//插入业绩表
            // })
            console.log('系统正在结算完成')
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



