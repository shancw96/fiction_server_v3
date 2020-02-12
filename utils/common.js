const iconv = require("iconv-lite");

//transferGbkToBuffer :: String -> String
function transferGbkToBuffer(str) {
  const buffer = iconv.encode(str, "gbK");
  let temp = "";
  for (let i = 0; i < buffer.length; i++) {
    temp += `%${buffer[i].toString(16)}`;
  }

  return temp.toUpperCase();
}

const getHostName = website => website.match(/(w+)(\.)([a-z]+)(\.)(com)/)[3]; // ['www.xxx.com','www','.','xxx','.'.'com',.....]
module.exports = { transferGbkToBuffer, getHostName };
