const send = require('koa-send')
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

module.exports = {downloadFont}