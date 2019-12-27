const Router = require("koa-router");
const fictionRouter = require("./fiction");
const userRouter = require("./user");
const rootRooter = new Router();

rootRooter.use("/fiction", fictionRouter.routes()); // 小说相关路由
rootRooter.use("/user", userRouter.routes());

module.exports = rootRooter;
