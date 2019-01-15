# member

移动端接口
登录接口：POST，支持手机号/ID编号登录，需要响应用户不存在或密码错误
POST http://localhost:3636/xserver/auth/login (√)
{
    mobile:18780004427,
    id:MY10001,
    password:'123345'
}
{
    err:true/false,
    res:登录失败原因
}
获取用户信息接口：GET，通过传递_id，获取用户所有信息
GET http://localhost:3636/xnosql/user/get/:_id (√)
{
    err:完整用户对象，没有返回null
    res:失败原因
}
编辑收货地址接口：POST，修改收货地址，收货人，收货电话 (√)
POST http://localhost:3636/xnosql/user/update
{
    用户对象，包含_id和需要修改的字段属性，自动路由可处理，只需要检查inparam
}
{
    err:true/false
    res:失败原因
}
用户注册接口：POST，完整用户信息注册
POST http://localhost:3636/xnosql/user/insert (√)
{
    用户注册对象
}
{
    err:true/false
    res:失败原因
}
提现申请接口：POST，传递提现申请金额
POST http://localhost:3636/xnosql/bill/insert (√)
{
    userId:userId,
    type:OUT
    amount:1000.00
}
{
    err:true/false
    res:失败原因
}
账单查询接口：POST，响应用户账单列表
POST http://localhost:3636/xnosql/bill/query (√)
{
    userId:MY10001
}
{
    err:账单数组列表，没有返回null
    res:失败原因
}
订单新增接口：POST，响应订单新增接口
POST http://localhost:3636/xnosql/order/insert (√)
{
    userId:MY10001
    products:[{id,price,num}]
}
{
    err:true/false
    res:失败原因
}
产品查询接口：POST
POST http://localhost:3636/xnosql/product/query (√)
{
}
{
    err:true/false
    res:[产品列表数组]
}
业绩查询接口：POST
POST http://localhost:3636/xserver/achievement/query
{
    userId:userId,
    time:'201901(上)'
}
{
    err:true/false
    res:{achievements:[market,accumulate,current],amount}
}


PC端接口
