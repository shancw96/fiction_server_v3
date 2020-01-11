const Router = require("koa-router");
const User = require("../controller/user");

let router = new Router();

//routes
router.post("/login", User.login);
router.post("/register", User.register);
router.post("/storeToCloud", User.storeToCloud);
module.exports = router;
