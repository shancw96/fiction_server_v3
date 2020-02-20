const Router = require("koa-router");
const file = require("../controller/file");
let router = new Router();

//routes
router.get("/download", file.downloadFont);
router.get('/recordLog',file.recordLog)
router.get('/getTodayLog',file.getTodayLog)
router.get('/getThreeDayLog',file.getThreeDayLog)
router.get('/getWeekDaylog',file.getWeekDaylog)


module.exports = router;
