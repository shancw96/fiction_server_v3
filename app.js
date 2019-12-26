const [
  wensang_search,
  wensang_filterSearch,
  wensang_SearchUrl
] = require("./wensang/axiosTypeSearch");

const [
  twok_search,
  twoK_filterSearch,
  twoK_searchUrl
] = require("./encodedChar");

const keyWord = "遮天";

let wensang = wensang_search(wensang_filterSearch, keyWord, wensang_SearchUrl);
let twoK = twok_search(twoK_filterSearch, twoK_searchUrl);

Promise.race([wensang, twoK]).then(res => console.log(res));
