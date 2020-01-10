const Router = require("koa-router");
const file = require("../controller/file");
let router = new Router();

//routes
router.get("/download", file.downloadFont);

module.exports = router;
