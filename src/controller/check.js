// 路由相关
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectID
router.post('/test', async (ctx, next) => {
    let token = ctx.tokenVerify  // 获取TOKEN解析结果
    if (token.role != 'admin' ){
        throw  { err: true, res: '当前账号没有权限' }
    }
    let inparam = ctx.request.body
    const people = await mongodb.find('user', { id: inparam.id })
    const father = await mongodb.find('user', { id: inparam.people[0].parentId })
    inparam.people = people;inparam.father = father
    let a = await getReferralBonuses(inparam)
    //更新用户状态
    //更新奖励状态
    ctx.body = { err: false, res: a }
})

async function getReferralBonuses(inparam) {
    inparam.id          //当前激活用户
    inparam.initPrice   //当前激活选择的用户的套餐价格
    //查询奖励

    //1.查出当前状态变更的用户
    if (inparam.people.length > 0 && inparam.people[0].id != 'root') {
        //2.0 通过当前用户的安置信息
        //2.0.1 推荐奖与回本奖
        
        if (inparam.father[0].referralBonuses.status == 'null') {
            //第一阶段奖励
            //更新状态
            await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase1', phase1: { id: inparam.id, price: inparam.initPrice * 0.2 } } } })
            await mongodb.insert('achievement', { userId: inparam.id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: Date.now(), remark: '第一阶段' })
            return { userId: inparam.userId, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: Date.now(), remark: '第一阶段' }
        } else if (inparam.father[0].referralBonuses.status == 'phase1' && inparam.father[0].referralBonuses.phase1.id != inparam.id) {
            //判断phase1是否为0套餐
            if (inparam.father[0].referralBonuses.phase1.price != 0) {
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase1', phase2: { id: inparam.id, price: inparam.initPrice * 0.8 } } } })
            } else {
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase2', phase2: { id: inparam.id, price: inparam.initPrice * 0.2 } } } })
            }
            //更新业绩（余额，在当期结算时根据业绩更新）
            await mongodb.insert('achievement', { userId: inparam.id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: Date.now(), remark: '第二阶段' })
            return { userId: inparam.id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: Date.now(), remark: '第二阶段' }
        } else {
            throw { err: true, res: '该账户的父级账户已经完成推荐奖或已存在该ID' }
        }
    } else {
        throw { err: true, res: '找不到该激活用户，或该账户为root' }
    }
}


async function getMarketBonuses(inparam){
     //2.0.1 如果当前当前状态变更的用户，位置等级小于3,则不会出现市场奖
        // if (inparam.people[0].levelindex.length < 3) {

        // }
        //2.1 获取用户安置的根用户
        //2.2 获取当前用户所在层级
        //2.3 判断当前层级是否能够触发返奖
        //2.4 判断触发返奖的用户数组
        //2.5 记录需要返奖业绩，但不更新余额（余额需要在结算期更新，这里只更新业绩信息）
}
// let map = {
//     'key':8,
//     'val':{
//         'A':0.1,
//         'B':0.2
//     }

// }
//A:[A]
//B1:[A,B1]
//B2:[A,B2]
//C1:[A,B2,C1]

module.exports = router