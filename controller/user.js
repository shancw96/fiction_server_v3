const { dbHandler, close } = require("../db/index");
/**
 * 查询到结果：status:success , data:{...}
 * 未查询到结果:status:fail ,data:null
 *
 * @param  ctx 处理 登录请求
 */
const login = async ctx => {
    const { userName, passwd } = ctx.request.body;
    let queryResult = await dbHandler.findOne({ userName, passwd });
    const status = queryResult ? "success" : "fail";
    ctx.body = { status, data: queryResult };
};
/**
 * 两种情况:
 *  1. 成功注册：status:success
 * 2, 失败注册：status:fail msg:用户名已存在
 * @param  ctx
 */
const register = async ctx => {
    const { userName, passwd } = ctx.request.body;
    let queryResult = await dbHandler.findOne({ userName, passwd });
    ctx.body = queryResult ? { status: "success" } : { status: "fail", msg: "用户名已存在" };
};

module.exports = { login, register };