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
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        error.res = '当前为系统结算时间，请稍等再试' }
    
    if(!_id){
        error.res = '没有找到_id'
    }
    if (deliveryName) {
        if (!deliveryMobile || deliveryMobile.length > 11 || deliveryMobile.length < 6) {
            error.res = '请输入正确的收货人电话'
        }
        if (!deliveryAddress || deliveryAddress.length < 3) {
            error.res = '请输入正确的收货人地址'
        }
    }
    if (error.res) {
        throw error
    }
}

module.exports = check