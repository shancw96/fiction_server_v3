const axios = require("axios");
const { curry } = require("ramda");
const cheerio = require("cheerio");
const baseUrl = "https://www.biquge.com.cn";
const searchUrl = "https://www.biquge.com.cn/search.php?q=";
// asyncFetch :: function -> String -> Promise <pending> -> any
const asyncFetch = curry(async (fn, url) => {
    const { data } = await axios.get(url);
    return fn(cheerio.load(data));
});

const filterContent = $ => {
    const content =  ({
        text: $("div#content").html(),
        next:
            baseUrl +'/'+
            $("div.bottem2")
                .children("a")
                .eq(2)
                .attr("href")
                .slice(1),
        curTitle:$('div.bookname').children('h1').text()
    })
    
    return content
}

const filterChapter = $ => {
    const chapterList = $("dd").children("a");
    return Array(chapterList.length)
        .fill("")
        .map((_, index) => ({
            title:  chapterList.eq(index).text(),
            href: baseUrl + chapterList.eq(index).attr("href")
        }));
};

const filterSearch = $ => {
    const rawSearchList = $("div.result-game-item-detail");
    return Array(rawSearchList.length)
        .fill("")
        .map((_, index) => ({
            title: rawSearchList
                .eq(index)
                .children("h3")
                .children("a")
                .children("span")
                .text(),
            chapterList:
                baseUrl +
                rawSearchList
                    .eq(index)
                    .children("h3")
                    .children("a")
                    .attr("href"),
            bookHome:
                baseUrl +
                rawSearchList
                    .eq(index)
                    .children("h3")
                    .children("a")
                    .attr("href"),
            author: $("div.result-game-item-info")
                .eq(index)
                .children("p")
                .eq(0)
                .children("span")
                .eq(1)
                .text(),
            update: $("div.result-game-item-info")
                .eq(index)
                .children("p")
                .eq(2)
                .children("span")
                .eq(1)
                .text(),
            newChapter: $("div.result-game-item-info")
                .eq(index)
                .children("p")
                .eq(3)
                .children("a")
                .text(),
            img: $("img.result-game-item-pic-link-img")
                .eq(index)
                .attr("src")
        }));
};

const filterBookHome = $ => ({
    img: $("div#sidebar")
        .children("div")
        .children("img")
        .attr("src"),
    title: $("div#sidebar")
        .children("div")
        .children("img")
        .attr("alt"),
    author: $("div#info")
        .children("p")
        .eq(0)
        .text(),
    update: $("div#info")
        .children("p")
        .eq(2)
        .text(),
    desc: $("div#intro").text(),
    tags: [
        $("div.con_top")
            .children("a")
            .text(),
        $("div#info")
            .children("p")
            .eq(1)
            .text()
    ],
    chapterList: ""
});

const biquge_search = rawKeyWord => asyncFetch(filterSearch, encodeURI(searchUrl + rawKeyWord));
const biquge_chapter = asyncFetch(filterChapter);
const biquge_content = asyncFetch(filterContent);
const biquge_bookHome = asyncFetch(filterBookHome);

module.exports = { biquge_search, biquge_chapter, biquge_content, biquge_bookHome };
