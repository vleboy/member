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
        price,
        userId, 
        deliveryName,
        deliveryMobile,
        deliveryAddress 
    } = inparam

    if (!(products || price || userId ||deliveryName||deliveryMobile||deliveryAddress)) {
        error.res = '请输入正确的参数'
    }
    if(products.length ===0){
        error.res = '产品不存在'
    }
    if(price < 0){
        error.res = '产品价格不能为负'
    }
    if (deliveryName) {
        if (!deliveryMobile || deliveryMobile.length > 11 || deliveryMobile.length < 6) {
            error.res = '请输入正确的收货人电话'
        }
        if (!deliveryAddress || deliveryAddress.length < 3) {
            error.res = '请输入正确的收货人地址'
        }
    }else {
        error.res = '请输入正确的收货人'
    }
    price = parseFloat(price)
    if (error.res) {
        throw error
    }
}

module.exports = check