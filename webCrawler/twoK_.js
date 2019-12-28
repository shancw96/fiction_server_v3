const iconv = require("iconv-lite");
const cheerio = require("cheerio");
const https = require("https");
const R = require("ramda");
const { transferGbkToBuffer } = require("../utils/common");

//URL base
const baseUrl = "https://www.fpzw.com";
//URL_search
const twoKSearch = "/modules/article/search.php?searchtype=keywords&searchkey=";

//URL_chapter
const chapterUrl = "https://www.fpzw.com/xiaoshuo/54/54166/";
//URL_content
const contentUrl = "https://www.fpzw.com/xiaoshuo/54/54166/10482487.html";

const asyncFetch = R.curry(function(fn, url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let chunks = [];

        res.on("data", chunk => chunks.push(chunk));

        res.on("end", _ => {
          let _html = iconv.decode(Buffer.concat(chunks), "gb2312");
          resolve(fn(_html));
        });
      })
      .on("error", err => reject(`asyncFetch Error:${err}`));
  });
});

function filterContent(html) {
  const $ = cheerio.load(html);
  const Content = {
    text: $("p.Text").html(),
    next: `${baseUrl}${$("div.thumb")
      .children("a")
      .eq(0)
      .attr("href")}`,
    perv: `${baseUrl}${$("div.thumb")
      .children("a")
      .eq(4)
      .attr("href")}`
  };

  return Content;
}

function filterSearch(html) {
  const $ = cheerio.load(html);
  const rawSearchList = $("tr").slice(1);
  return Array(rawSearchList.length)
    .fill("")
    .map((_, index) => ({
      title: rawSearchList
        .eq(index)
        .children("td")
        .eq(0)
        .children("a")
        .text(),
      chapterList: rawSearchList
        .eq(index)
        .children("td")
        .eq(1)
        .children("a")
        .attr("href"),
      author: rawSearchList
        .eq(index)
        .children("td")
        .eq(2)
        .text(),
      update: rawSearchList
        .eq(index)
        .children("td")
        .eq(4)
        .text(),
      isDone: rawSearchList
        .eq(index)
        .children("td")
        .eq(5)
        .text(),
      newChapter: rawSearchList
        .eq(index)
        .children("td")
        .eq(1)
        .children("a")
        .text()
    }));
}

function filterChapter(html) {
  const $ = cheerio.load(html);
  const chapterList = $("dd").children("a");
  return Array(chapterList.length)
    .fill("")
    .map((_, index) => ({
      title: chapterList.eq(index).text(),
      href: `${chapterUrl}${chapterList.eq(index).attr("href")}`
    }));
}

//twoKSearch ::String -> Array
const twoK_search = rawKeyword =>
  asyncFetch(
    filterSearch,
    `${baseUrl}${twoKSearch}${transferGbkToBuffer(rawKeyword)}`
  );

const twoK_chapter = asyncFetch(filterChapter);
const twoK_content = asyncFetch(filterContent);
module.exports = { twoK_search, twoK_chapter, twoK_content };
