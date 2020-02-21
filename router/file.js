const Router = require("koa-router");
const file = require("../controller/file");
let router = new Router();

//routes
router.get("/download", file.downloadFont);
router.get('/recordLog',file.recordLog)
router.get('/queryLog',file.queryLog)
router.get('/getTodayLog',file.getTodayLog)


module.exports = router;
