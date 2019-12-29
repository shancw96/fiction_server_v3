const { wensang_search, wensang_chapter, wensang_content, wensang_bookHome } = require("./wensang");
const { twoK_search, twoK_chapter, twoK_content, twoK_bookHome } = require("./twoK_");
const { biquge_search, biquge_chapter, biquge_content, biquge_bookHome } = require("./biquge");
const { getHostName } = require("../utils/common");
const { curry } = require("ramda");

// searchResult ::String -> f1 .. fn ->Promise <pending>
const fetchSearchResult = (keyword, ...fnArr) => Promise.all(fnArr.map(fn => fn(keyword)));

/**
 * 整合content 与 chapter 函数
 *  传入url，获取对应的 函数
 */
//fetchContentContaienr ::String type, String url-> Promise
const filterWebsite = curry((type, url) => {
    const exactMode = `${getHostName(url)}_${type}`;
    switch (exactMode) {
        //文桑
        case "wensang_chapter":
            console.log(`mode ${type} -${exactMode}`);
            return wensang_chapter(url);
        case "wensang_content":
            console.log(`mode ${type} -${exactMode}`);
            return wensang_content(url);
        case "wensang_bookHome":
            return wensang_bookHome(url);
        //2k
        case "fpzw_chapter":
            console.log(`mode ${type} -${exactMode}`);
            return twoK_chapter(url);
        case "fpzw_content":
            console.log(`mode ${type} -${exactMode}`);
            return twoK_content(url);
        case "fpzw_bookHome":
            return twoK_bookHome(url);
        //笔趣阁
        case "biquge_chapter":
            console.log(`mode ${type} -${exactMode}`);
            return biquge_chapter(url);
        case "biquge_content":
            console.log(`mode ${type} -${exactMode}`);
            return biquge_content(url);
        case "biquge_bookHome":
            return biquge_bookHome(url);
        default:
            new Error("invaild url or type");
    }
});

module.exports = {
    fetchSearchResult,
    filterWebsite,
    wensang_search,
    twoK_search,
    biquge_search
};
