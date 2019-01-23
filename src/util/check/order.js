function check(inparam) {
    const error = {
        err: true,
        res: null
    }
 /*
    * @param products 产品数组[{id,price,num}]
    * @param price 订单价格
    * @param userId 用户ID
    * @param deliveryName 收货人
    * @param deliveryMobile 收货人电话
    * @param deliveryAddress 收货地址
*/
    let {
        products,
        userId, 
    } = inparam

    if (!products || !userId ) {
        error.res = '请输入正确的参数'
    }
    if(products.length ===0){
        error.res = '产品不存在'
    }

    if (error.res) {
        throw error
    }
}

module.exports = check