const {
  wensang_search,
  wensang_chapter,
  wensang_content
} = require("./wensang");
const { twoK_search, twoK_chapter, twoK_content } = require("./twoK_");
const { biquge_search, biquge_chapter, biquge_content } = require("./biquge");
const { getHostName } = require("../utils/common");
const { curry } = require("ramda");

const mock = {
  wensang: {
    chapterUrl: "https://www.wensang.com/book/121643/",
    contentUrl: "https://www.wensang.com/book/121643/0.html"
  },
  twoK: {
    chapterUrl: "https://www.fpzw.com/xiaoshuo/54/54166/",
    contentUrl: "https://www.fpzw.com/xiaoshuo/54/54166/10482487.html"
  },
  biquge: {
    chapterUrl: "https://www.biquge.com.cn/book/30360/",
    contentUrl: "https://www.biquge.com.cn/book/30360/44487.html"
  }
};

// searchResult ::String -> f1 .. fn ->Promise <pending>
const fetchSearchResult = (keyword, ...fnArr) =>
  Promise.all(fnArr.map(fn => fn(keyword)));

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
      return wensang_chapter(url);
    case "wensang_content":
      return wensang_content(url);
    //2k
    case "fpzw_chapter":
      return twoK_chapter(url);
    case "fpzw_content":
      return twoK_content(url);
    //笔趣阁
    case "biquge_chapter":
      return biquge_chapter(url);
    case "biquge_content":
      return biquge_content(url);

    default:
      new Error("invaild url or type");
  }
});

//   filterWebsite("chapter", mock.twoK.chapterUrl);
//   filterWebsite("content", mock.wensang.contentUrl);
fetchSearchResult(
  "遮天",
  wensang_search,
  twoK_search,
  biquge_search
).then(res => console.log(res));

module.exports = { fetchSearchResult, filterWebsite };
