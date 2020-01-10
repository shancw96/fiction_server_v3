const Router = require("koa-router");
const fictionRouter = require("./fiction");
const userRouter = require("./user");
const fileRouter = require('./file')
const rootRooter = new Router();

rootRooter.use("/fiction", fictionRouter.routes()); // 小说相关路由
rootRooter.use("/user", userRouter.routes());
rootRooter.use("/file",fileRouter.routes())
module.exports = rootRooter;
