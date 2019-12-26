const Formdata = require("form-data");
const https = require("https");
const iconv = require("iconv-lite");

let form = new Formdata();
form.append("action", "search");
form.append("q", "测试");

const header = form.getHeaders();

const myrequest = https.request(
  {
    method: "post",
    host: "www.wensang.com",
    path: "/home/search",
    headers: header
  },
  res => {
    let chunks = [];

    res.on("data", chunk => chunks.push(chunk));

    res.on("end", _ => {
      let _html = iconv.decode(Buffer.concat(chunks), "utf-8");
      console.log(_html);
    });
  }
);

form.pipe(myrequest);
