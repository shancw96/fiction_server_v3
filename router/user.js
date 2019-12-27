const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
let router = new Router();

//routes
router.post("/login", async ctx => {
  const userInfo = ctx.request.body;
  console.log(userInfo);
  ctx.body = "router user connect";
});

module.exports = router;
