const { curry } = require("ramda");
const Formdata = require("form-data");
const axios = require("axios");

const { transferGbkToBuffer } = require('../utils/common')
/**
 * 千千看书 - 搜索 GBK 参考twok
 */
const asyncPostSearch = curry(async (fn, url, keyword) => {
    let form = new Formdata();
    const headers = form.getHeaders();
    // form.append('searchtype', 'articlename')
    form.append("searchkey", keyword)
    let myRes = await axios.request({
        url,
        method: "post",
        data: form,
        timeout: 10 * 1000,
        headers
    })
    return fn(myRes)
})

asyncPostSearch(_ => _, 'https://www.qianqianxsw.com/modules/article/search.php', transferGbkToBuffer("山河")).then(res => console.log(res)).catch(e => console.log(e))
