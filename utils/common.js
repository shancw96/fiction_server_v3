const iconv = require("iconv-lite");
const path = require('path')
const logPath = path.resolve(__dirname, '../log')
//transferGbkToBuffer :: String -> String
function transferGbkToBuffer(str) {
  const buffer = iconv.encode(str, "gbK");
  let temp = "";
  for (let i = 0; i < buffer.length; i++) {
    temp += `%${buffer[i].toString(16)}`;
  }

  return temp.toUpperCase();
}
function writeToLog(ipInfo, ip, path = logPath) {
  const DayDir = path + '/' + moment().format('YYYY-MM-DD')
  const ipFile = DayDir + '' + ip + '.json'
  //创建或确认目录
  if (!fs.existsSync(DayDir)) {
    fs.mkdirSync(DayDir)
  }
  //确认文件是否存在
  if (!fs.existsSync(ipFile)) {
    writeFile(ipFile, {}, ipInfo)
  } else {
    writeFile(ipFile, JSON.parse(fs.readFileSync(ipFile)), ipInfo)
  }

  function writeFile(path, target, content) {
    fs.writeFileSync(path, JSON.stringify({ ...target, [moment().format('h:mm:ss a')]: content }))
  }
}
const getHostName = website => website.match(/(w+)(\.)([a-z]+)(\.)(com)/)[3]; // ['www.xxx.com','www','.','xxx','.'.'com',.....]
module.exports = { transferGbkToBuffer, getHostName, writeToLog };
