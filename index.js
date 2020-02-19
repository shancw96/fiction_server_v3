const Koa = require("koa");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router/root");
const stdout = require("shancw-stdout");

//static source import
const fs = require("fs");
const path = require("path");
const static = require("koa-static"); //静态资源
const staticPath = "../fiction-search-v3/oh-my-fiction-dist/";

const PORT = 4008;
const server = new Koa();
server.proxy = true;

server.listen(PORT, () => {
    stdout.bgGreen(`new fiction server start at port:${PORT}`);
});

router.get("/", ctx => {
    let html = fs.readFileSync(path.resolve(__dirname, "../fiction-search-v3/oh-my-fiction-dist/index.html"), "utf-8");
    ctx.body = html;
});

server
    .use(cors())
    .use(bodyParser())
    .use(static(path.join(__dirname, staticPath)))
    .use(router.allowedMethods())
    .use(router.routes())
    
