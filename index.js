const Koa = require("koa");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router/root");

const PORT = 4009;
const server = new Koa();

server.listen(PORT, () => {
  console.log(`new ficiton server start at port:${PORT}`);
});

server
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());
