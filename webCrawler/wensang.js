const Formdata = require("form-data");
const axios = require("axios");
const cheerio = require("cheerio");
const R = require("ramda");

const contentUrl = "https://www.wensang.com/book/121643/0.html";
const chapterListUrl = "https://www.wensang.com/book/121643/";
const searchUrl = "https://www.wensang.com/home/search";

const asyncPostSearch = R.curry(async function(fn, url, keyword) {
  let form = new Formdata();
  const headers = form.getHeaders();
  form.append("action", "search");
  form.append("q", keyword);

  let myRes = await axios.request({
    url: url,
    method: "post",
    data: form,
    timeout: 10 * 1000,
    headers
  });

  return fn(myRes.data);
});

const asyncGetFetch = R.curry(async function(fn, url) {
  let { data } = await axios.get(url);
  return fn(data);
});

function filterSearch(html) {
  const $ = cheerio.load(html);
  const contentList = $("div.cf").children("dl");
  return Array(contentList.length)
    .fill("")
    .map((_, index) => ({
      title: contentList
        .eq(index)
        .children("dd")
        .eq(0)
        .children("h3")
        .eq(0)
        .children("a")
        .text(),
      author: contentList
        .eq(index)
        .children("dd")
        .eq(1)
        .children("span")
        .eq(0)
        .text(),
      update: contentList
        .eq(index)
        .children("dd")
        .eq(0)
        .children("h3")
        .eq(0)
        .children("span")
        .text(),
      isDone: contentList
        .eq(index)
        .children("dd")
        .eq(1)
        .children("span")
        .eq(1)
        .text(),

      chapterList:
        "https://www.wensang.com" +
        contentList
          .eq(index)
          .children("dd")
          .eq(0)
          .children("h3")
          .eq(0)
          .children("a")
          .attr("href")
    }));
}

function filterChapter(html) {
  const $ = cheerio.load(html);
  const chapterList = $("div#allChapter")
    .children("ul")
    .eq(0)
    .children("li");
  //   console.log(chapterList.length);
  const testArr = Array(chapterList.length)
    .fill("")
    .map((_, index) => ({
      title: chapterList
        .eq(index)
        .children("a")
        .children("span")
        .text(),
      href: chapterList
        .eq(index)
        .children("a")
        .attr("href")
    }));
  return testArr;
}

function filterContent(html) {
  const $ = cheerio.load(html);
  const content = {
    text: $("div#BookText").html(),
    next: $("div.paper-footer")
      .children("a")
      .eq(2)
      .attr("href"),
    prev: $("div.paper-footer")
      .children("a")
      .eq(0)
      .attr("href")
  };
  return content;
}

//对外暴露
//wensang_search :: String -> Array
const wensang_search = asyncPostSearch(filterSearch, searchUrl);

const wensang_chapter = asyncGetFetch(filterChapter);
const wensang_content = asyncGetFetch(filterContent);
module.exports = { wensang_search, wensang_chapter, wensang_content };
