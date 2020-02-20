const iconv = require("iconv-lite");
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const stdout = require("shancw-stdout");



//transferGbkToBuffer :: String -> String
function transferGbkToBuffer(str) {
  const buffer = iconv.encode(str, "gbK");
  let temp = "";
  for (let i = 0; i < buffer.length; i++) {
    temp += `%${buffer[i].toString(16)}`;
  }

  return temp.toUpperCase();
}

const logPath = path.join(__dirname, '../log')
if(!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

function writeToLog(ipInfo, ip, path = logPath) {
  const DayDir = path + '/' + moment().format('YYYY-MM-DD')
  const ipFile = DayDir + '/' + ip + '.json'
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
    fs.writeFile(path, JSON.stringify({ ...target, [moment().format('h:mm:ss a')]: content }), (err) => {
      if (err) console.log(err)
      else{
        stdout.bgGreen('已记录用户ip 信息')
        stdout.blue(path)
      }

    })
  }
}
const getHostName = website => website.match(/(w+)(\.)([a-z]+)(\.)(com)/)[3]; // ['www.xxx.com','www','.','xxx','.'.'com',.....]

function getLogDirList(curPath=logPath){
  const source = fs.readdirSync(logPath)
  const res = source.map(name => path.join(curPath, name)).filter(path => fs.lstatSync(path).isDirectory())
  return res
}
module.exports = { transferGbkToBuffer, getHostName, writeToLog,getLogDirList };
