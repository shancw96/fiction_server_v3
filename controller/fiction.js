const Router = require("koa-router");
let router = new Router();

//routes
router.get("/search", async ctx => {
  const { keyword } = ctx.query;
  console.log(keyword);
  ctx.body = "connected";
});

module.exports = router;
