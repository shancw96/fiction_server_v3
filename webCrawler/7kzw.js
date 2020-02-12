const { curry } = require("ramda");
const Formdata = require("form-data");
const axios = require("axios");

/**
 * 奇快中文 - 搜索 gbk
 */
const asyncPostSearch = curry(async (fn, url, keyword) => {
    let form = new Formdata();
    const headers = form.getHeaders();
    form.append('name', keyword)
    let myRes = await axios.request({
        url,
        method: "post",
        data: form,
        timeout: 20 * 1000,
        headers
    })
    return fn(myRes)
})

asyncPostSearch(_ => _, 'https://www.7kzw.com/index.php?s=/web/index/search', '山河').then(res => console.log(res)).catch(e => console.log(e))
