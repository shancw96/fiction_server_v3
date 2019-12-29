const Formdata = require("form-data");
const axios = require("axios");
const cheerio = require("cheerio");
const R = require("ramda");

const BaseUrl = "https://www.wensang.com";
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
            img:
                BaseUrl +
                contentList
                    .eq(index)
                    .children("dt")
                    .children("a")
                    .children("img")
                    .attr("src"),
            chapterList:
                BaseUrl +
                contentList
                    .eq(index)
                    .children("dd")
                    .eq(0)
                    .children("h3")
                    .eq(0)
                    .children("a")
                    .attr("href"),
            bookHome:
                BaseUrl +
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
        next:
            "https://www.wensang.com" +
            $("div.paper-footer")
                .children("a")
                .eq(2)
                .attr("href"),
        prev:
            "https://www.wensang.com" +
            $("div.paper-footer")
                .children("a")
                .eq(0)
                .attr("href")
    };
    return content;
}

function filterRecommand(html) {
    console.log("--- wensag recommand");
    const $ = cheerio.load(html);
    const rawRecommand = $("ul.detail-list").children("li");
    return Array(rawRecommand.length)
        .fill("")
        .map((_, index) => ({
            href:
                BaseUrl +
                rawRecommand
                    .eq(index)
                    .children("div")
                    .children("a")
                    .attr("href"),
            img:
                BaseUrl +
                rawRecommand
                    .eq(index)
                    .children("div")
                    .children("a")
                    .eq(0)
                    .children("div")
                    .children("img")
                    .attr("src"),
            title: rawRecommand
                .eq(index)
                .children("div")
                .children("a")
                .eq(1)
                .text(),
            desc: $("div.slide-cover")
                .eq(index)
                .children("p")
                .text()
        }));
}

function filterBookHome(html) {
    const $ = cheerio.load(html);
    return {
        img:
            BaseUrl +
            $("div.info-box")
                .children("a")
                .children("img")
                .attr("src"),
        author: $("div.infos.fl")
            .children("div.field.clear")
            .children("span.fl")
            .eq(0)
            .children("a")
            .text(),
        title: $("div.infos")
            .children("h1.text-title")
            .children("a")
            .text(),
        update: $("span#bookPrice.fl").text(),
        desc: $("div.desc.desc-long.hide").text(),
        tags: [
            $("div.field.clear")
                .children("span.fl")
                .eq(1)
                .children("a")
                .text(),
            $("div.field.clear")
                .children("span.fl")
                .eq(2)
                .text()
        ],
        chapterList: $("div.infos")
            .children("h1.text-title")
            .children("a")
            .attr("href")
    };
}

//对外暴露
//wensang_search :: String -> Array
const wensang_search = asyncPostSearch(filterSearch, searchUrl);

const wensang_chapter = asyncGetFetch(filterChapter);
const wensang_content = asyncGetFetch(filterContent);
const recommandFiction = asyncGetFetch(filterRecommand);
const wensang_bookHome = asyncGetFetch(filterBookHome);
module.exports = { wensang_search, wensang_chapter, wensang_content, recommandFiction, wensang_bookHome };
