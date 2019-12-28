const { fetchSearchResult, filterWebsite } = require("../webCrawler/index");
const {
  wensang_search,
  twoK_search,
  biquge_search
} = require("../webCrawler/index");
const getSearch = async ctx => {
  const { keyword, accurateSearch } = ctx.query;
  switch (accurateSearch) {
    case "wensang":
      console.log("code in ");
      ctx.body = await fetchSearchResult(keyword, wensang_search);
      break;
    case "twoK":
      ctx.body = await fetchSearchResult(keyword, twoK_search);
      break;
    case "biquge":
      ctx.body = await fetchSearchResult(keyword, biquge_search);
      break;
    default:
      ctx.body = await fetchSearchResult(
        keyword,
        wensang_search,
        twoK_search,
        biquge_search
      );
  }
};
//传入fn ，返回异步函数，等待传入url ，执行fn
const getContainer = fn => async ctx => {
  const { url } = ctx.query;
  ctx.body = await fn(url);
};

const getContent = getContainer(filterWebsite("content"));
const getChapter = getContainer(filterWebsite("chapter"));

module.exports = { getSearch, getContent, getChapter };
