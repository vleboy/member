function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    const {
        name,
        desc,
        img,
        price,
        activity,
    } = inparam

    if (!name || name.length < 2 || name.length > 18) {
        error.res = '名字2-8个字'
    } else if (!desc || desc.length > 100) {
        error.res = '产品描述不能为空，或者超过100个字符'
    } else if (!img) {
        error.res = '产品图片不能为空'
    }
    else if (!price || price <= 0 || price > 100000000000) {
        error.res = '产品价格必须在0 - 100000000000 之间'
    }
    else if (!activity) {
        error.res = '活动描述不能为空'
    }
    if (error.res) {
        throw error
    }

}

module.exports = check