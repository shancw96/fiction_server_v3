const { dbUser, close } = require("../db/index");
const stdout = require("shancw-stdout");
const jwt = require('jsonwebtoken')
const SECRET_KEY = "i am very secret"

const verifyToken = token=>{
    try{
        const {userName,passwd} = jwt.verify(token,SECRET_KEY)
        stdout.red(`decoded user :${userName} -- ${passwd}`)
    }catch(e){
        return false
    }
    

}
/**
 * 查询到结果：status:success , data:{...}
 * 未查询到结果:status:fail ,data:null
 *
 * @param  ctx 处理 登录请求
 */
const login = async ctx => {
    const { userName, passwd } = ctx.request.body;
    let queryResult = await dbUser.findOne({ userName, passwd });
    // const status = queryResult ? "success" : "fail";
    // ctx.body = { status, data: queryResult };
    if(!queryResult){
        ctx.body = {status:'fail',data:null}
    }else{
        // 生成token
        const {userName,passwd} = queryResult
        const token = jwt.sign({userName,passwd},SECRET_KEY,{expiresIn:'1 days'})
        ctx.body  = {
            token,
            data:queryResult
        }
    }
};
/**
 * 两种情况:
 *  1. 成功注册：status:success
 * 2, 失败注册：status:fail msg:用户名已存在
 * @param  ctx
 */
const register = async ctx => {
    const { userName, passwd } = ctx.request.body;
    let queryResult = await dbUser.findOne({ userName, passwd });
    if (queryResult) {
        console.log(queryResult);
        ctx.body = { status: "fail", msg: "用户名已存在" };
    } else {
        //插入
        try {
            await dbUser.save({ userName, passwd });
            ctx.body = { status: "success" };
        } catch (e) {
            stdout.red(e);
            ctx.body = e;
        }
    }
};

/**
 * 获取前端header中authorization 的值 作为token
 * 将token 解析出来后，查询数据库，进行更新操作
 */

const storeToCloud = async ctx=>{
    //获取用户信息
    const {books} = ctx.request.body
    const token = ctx.request.header['authorization']
    const userInfo  = verifyToken(token)
    if(!userInfo){
        ctx.body={
            status:'fail',
            msg:"认证失败，请重新登录'"
        }
    }else{
        try{
            await dbUser.update({userName},{books})
            ctx.body = {status:'success',msg:'上传成功'}
        }catch(e){
            stdout.red(e)
            ctx.body={
                status:'fail',
                msg:e
            }
    }
}

const getFromCloud = async ctx=>{
    const token = ctx.request.header['authorization']
    const userInfo = verifyToken(token)
    if(!userInfo) {
        ctx.body = {
            status:'fail',
            msg:"认证失败，请重新登录'"
        }
    }else{
        try{
            ctx.body = await dbUser.findOne({...userInfo})
        }catch(e){
            ctx.body = {
                status:'fail',
                msg:"未查询到该用户"
            }
        }
        
    }
}


module.exports = { login, register,storeToCloud,getFromCloud };
