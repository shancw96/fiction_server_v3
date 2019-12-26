const iconv = require("iconv-lite");
const cheerio = require("cheerio");
const https = require("https");
const axios = require("axios");
function transferGbkString(str) {
  const buffer = iconv.encode(str, "gbK");
  let temp = "";
  for (let i = 0; i < buffer.length; i++) {
    temp += `%${buffer[i].toString(16)}`;
  }
  return temp.toUpperCase();
}

const baseUrl = "https://www.fpzw.com";

const twoKSearch = "/modules/article/search.php?searchtype=keywords&searchkey=";
const keyWord = transferGbkString("测试");
const searchUrl = `${baseUrl}${twoKSearch}${keyWord}`;

const chapter = "/xiaoshuo/54/54166/";
const chapterUrl = "https://www.fpzw.com/xiaoshuo/54/54166/";

const contentUrl = "https://www.fpzw.com/xiaoshuo/54/54166/10482487.html";

// asyncFetch(filterChapter, chapterUrl).then(res => console.log(res));
// asyncFetch(filterContent, contentUrl).then(res => console.log(res));
// const fetchChapter = asyncFetch(filterChapter,chapterUrl)
function asyncFetch(fn, url) {
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
}

function filterContent(html) {
  const $ = cheerio.load(html);
  //   console.log($);
  const Content = {
    text: $("p.Text").text(),
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
        .text()
    }));
}

function filterChapter(html) {
  const $ = cheerio.load(html);
  const chapterList = $("dd").children("a");
  const testArr = Array(chapterList.length)
    .fill("")
    .map((_, index) => ({
      title: chapterList.eq(index).text(),
      href: `${chapterUrl}${chapterList.eq(index).attr("href")}`
    }));
  return testArr;
}

module.exports = [asyncFetch, filterSearch, searchUrl];
