const send = require('koa-send')
const axios = require('axios')
const moment = require('moment')
const path = require('path')

const {existsSync,readFileSync,readdirSync} = require('fs')
const {getLogDirList,writeToLog} = require('../utils/common')

const logFilter =judgementFn=> async ctx=>{
    console.log('获取服务器的用户log')
    const logPathList = getLogDirList().filter(judgementFn)
    const logList = logPathList.map(logPath=>{
        if(existsSync(logPath)){
            const fileList = readdirSync(logPath)
            return fileList.map(curPath=>JSON.parse(readFileSync(path.join(logPath,curPath),'utf-8')))
        }
    })

    ctx.body = logList
}
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

const getTodayLog = logFilter(getDaysLog(1))
const getThreeDayLog = logFilter(getDaysLog(3))
const getWeekDaylog = logFilter(getDaysLog(7))


module.exports = {downloadFont,recordLog,getTodayLog,getThreeDayLog,getWeekDaylog}