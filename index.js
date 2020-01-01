const Koa = require("koa");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router/root");

//static source import
const static = require("koa-static");
const fs = require("fs");
const path = require("path");
const diskPath = "../oh-my-fiction-v3/oh-my-fiction-dist";

const PORT = 4008;
const server = new Koa();

server.listen(PORT, () => {
    console.log(`new fiction server start at port:${PORT}`);
});

router.get(
    "/",
    ctx =>
        (ctx.body = fs.readFileSync(
            path.resolve(__dirname, "../oh-my-fiction-v3/oh-my-fiction-dist/index.html"),
            "utf-8"
        ))
);

server
    .use(bodyParser())
    .use(cors())
    .use(static(path.join(__dirname, diskPath)))
    .use(router.routes())
    .use(router.allowedMethods());
