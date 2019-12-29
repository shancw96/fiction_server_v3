const { fetchSearchResult, filterWebsite } = require("../webCrawler/index");
const { recommandFiction } = require("../webCrawler/wensang");
const { wensang_search, twoK_search, biquge_search } = require("../webCrawler/index");
const getSearch = async ctx => {
    const { keyword, accurateSearch } = ctx.query;
    switch (accurateSearch) {
        case "wensang":
            console.log("-----search wensang ");
            ctx.body = await fetchSearchResult(keyword, wensang_search);
            break;
        case "twoK":
            console.log("-----search twoK ");
            ctx.body = await fetchSearchResult(keyword, twoK_search);
            break;
        case "biquge":
            console.log("-----search biquge ");
            ctx.body = await fetchSearchResult(keyword, biquge_search);
            break;
        default:
            console.log("-----search all");
            ctx.body = await fetchSearchResult(keyword, wensang_search, twoK_search, biquge_search);
    }
};
//传入fn ，返回异步函数，等待传入url ，执行fn
const getContainer = fn => async ctx => {
    const { url } = ctx.query;
    ctx.body = await fn(url);
};

const getRecommand = async ctx => (ctx.body = await recommandFiction("https://www.wensang.com"));

const getContent = getContainer(filterWebsite("content"));
const getChapter = getContainer(filterWebsite("chapter"));
const getBookHome = getContainer(filterWebsite("bookHome"));
module.exports = { getSearch, getContent, getChapter, getRecommand, getBookHome };
