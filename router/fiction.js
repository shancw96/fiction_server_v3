const Router = require("koa-router");
const fiction = require("../controller/fiction");
let router = new Router();

//routes
router.get("/search", fiction.getSearch);
router.get("/getChapterList", fiction.getChapter);
router.get("/getContent", fiction.getContent);

module.exports = router;
