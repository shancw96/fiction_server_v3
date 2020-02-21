const send = require('koa-send')
const axios = require('axios')
const moment = require('moment')
const path = require('path')

const {existsSync,readFileSync,readdirSync} = require('fs')
const {getDirList,getFileList,writeToLog} = require('../utils/common')

// const logFilter =judgementFn=> async ctx=>{
//     console.log('获取服务器的用户log')
//     const logPathList = getLogDirList().filter(judgementFn)
//     const logList = logPathList.map(logPath=>{
//         if(existsSync(logPath)){
//             const fileList = readdirSync(logPath)
//             return fileList.map(curPath=>JSON.parse(readFileSync(path.join(logPath,curPath),'utf-8')))
//         }
//     })

//     ctx.body = logList
// }
// const getTodayLog = logFilter(getDaysLog(1))
// const getThreeDayLog = logFilter(getDaysLog(3))
// const getWeekDaylog = logFilter(getDaysLog(7))
const getDaysLog = day=>path=>{
    const interval = (day-1)/2
    const tempArr = path.split('/')
    const dateNum = Number(tempArr[tempArr.length-1].replace(/\-/g,''))
    const todayNum = Number(moment().format('YYYYMMDD'))
    return (todayNum-interval)<=dateNum || dateNum<=(todayNum+interval)
}

const downloadFont = async ctx=>{
    try{
        console.log('download')
        const {fileName}  = ctx.query
        await send(ctx,`/home/shanCW/shanCW/static/${fileName}`)
    }catch(e){
        console.log('---downLoad file error')
        ctx.body=e
    }
}
const recordLog = async ctx=>{
        console.log('监测到用户：'+ctx.request.ip)
        const ipInfo = await axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ctx.request.ip}`)
        writeToLog(ipInfo.data.data,ctx.request.ip)
        ctx.body = 'connected'
        
}

/**
 * @description：获取指定日期的所有ip log 记录
 * @param {dataStr} 格式为2020-02-22 
 * @return {Array} [{ip:{time:{...data}}}]
 */
const getExactDayLogs = dateStr => {
    //query log dir 
    const curDayPath = path.join(__dirname,`../log/${dateStr}`)//当前天的路径
    const ipPathList =  getFileList(curDayPath)
    // dir exist :  -> [data]
    //通过fs 获取到ip数据
    const res = ipPathList.map(ipPath=>{
        const key = getIpInPath(ipPath)
        const value = JSON.parse(readFileSync(ipPath,'utf-8'))
        return {[key]:value}
    })
    return res

    function getIpInPath(str){
        const matched = str.match( /(\d+\.){3}(\d+)/g)
        return matched[0]
    }
}
const getTodayLog = ctx =>ctx.body = getExactDayLogs(moment().format('YYYY-MM-DD'))
const queryLog = ctx =>ctx.body = dateList.map(ctx.query.dateList)
module.exports = {downloadFont,recordLog,getTodayLog,queryLog}



