const Formdata = require("form-data");
const axios = require("axios");
const cheerio = require("cheerio");

let form = new Formdata();
form.append("action", "search");
form.append("q", "测试");

const headers = form.getHeaders();

const contentUrl = "https://www.wensang.com/book/121643/0.html";
const chapterListUrl = "https://www.wensang.com/book/121643/";

async function wensangPostSearch() {
  let myRes = await axios.request({
    url: "https://www.wensang.com/home/search",
    method: "post",
    data: form,
    timeout: 10 * 1000,
    headers
  });
  let res = filterSearch(myRes.data);
  console.log(res);
}

async function asyncGetFetch(fn, url) {
  let { data } = await axios.get(url);
  return fn(data);
}

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
      chapterList: contentList
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
  console.log("---filterChapter");
  console.log(html);
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
    text: $("div#BookText").text(),
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

// asyncGetFetch(filterChapter, chapterListUrl).then(res => {
//   console.log(res);
// });

asyncGetFetch(filterContent, contentUrl).then(res => {
  console.log(res);
});
