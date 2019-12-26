const request = require("./request");
const Formdata = require("form-data");

const service = axios.create({
  baseURL: "s", // api的base_url
  timeout: TIMEOUT, // request timeout
  // withCredentials: false, //  跨域安全策略 需要与后台协商
  headers: {
    "Content-Type": "multipart/form-data;charset=UTF-8"
  }
});

function sanqi(data) {
  return service({
    url: "https://www.32wxw.com/home/search",
    method: "post",
    data
  });
}

const form = new Formdata();
form.append("action", "search");
form.append("q", "测试");

sanqi(form).then(res => {
  console.log(res);
});
