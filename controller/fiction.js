const { fetchSearchResult, filterWebsite } = require("../webCrawler/index");

const getSearch = async ctx => {
  const { keyword } = ctx.query;
  ctx.body = await fetchSearchResult(keyword);
};
//传入fn ，返回异步函数，等待传入url ，执行fn
const getContainer = fn => async ctx => {
  const { url } = ctx.query;
  ctx.body = await fn(url);
};

const getContent = getContainer(filterWebsite("content"));
const getChapter = getContainer(filterWebsite("chapter"));

module.exports = { getSearch, getContent, getChapter };
