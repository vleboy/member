function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    //收货地址，收货人，收货电话
    const {
        _id,
        deliveryName,
        deliveryMobile,
        deliveryAddress
    } = inparam
    if(!_id){
        error.res = '没有找到_id'
    }
    if (deliveryName) {
        if (!deliveryMobile || deliveryMobile.length > 11) {
            error.res = '请输入正确的收货人电话 11位'
        }
        if (!deliveryAddress || deliveryAddress > 3) {
            error.res = '请输入正确的收货人地址'
        }
    }else {
        error.res = '请输入正确的收货人'
    }
    if (error.res) {
        throw error
    }
}

module.exports = check