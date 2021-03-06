- 整合剩下来的 search
- 统一数据格式
- 整合进现有的 server-fiction 项目/重写项目

# 整合 search

- 向外暴露单个 function 即可

```js
//search :: String keyword -> Promise <pending> -> Object {flag:String ,searchResult:Array}
const {wensange_search} = require('./wensang')
const {twoK_search} = require('./twoK)

//fetchSearchResult :: String keyword->(fn search)->..(fn search)-> Array searchList
const fetchSearchResult = (keyword, ...fnArr) => {
  return Promise.race(fnArr.map(fn => fn(keyword)));
};

//统一数据格式
searchList = {
    title:String,//文章名称
    author:String,//作者
    update:Date，//最近的更新时间
    chapterListHref:String,//章节列表连接页
    isDone:Boolean,//是否完结
}


```

## 整合 ChapterList 与 Content

> 根据传过来的 URL ，来决定调用哪个模块
> chapter ：chapterURL -> hostName ->(String URL -> Promise <Pendign>)-> Array chapterList
> Content ：contentURL -> hostName -> (String URL -> Promise <Pendign>)-> Object

**ChapterList 与 Content 使用同一个高阶函数，输入 hostName+mode，得到使用那个模块的哪个函数**

```js
//fetchContentContaienr ::String -> fn
const filterWebsite = (url, type) => {
  const exactMode = `${getHostName(hostName)}_${type}`;
  switch (exactMode) {
    case "wensang_chapter":
      fn = fetchWensang_chapter;
      break;
    case "wensang_content":
      fn = fetchWensang_content;
      break;
    case "fpzw_chapter":
      fn = fetchFpzw_chapter;
      break;
    case "fpzw_content":
      fn = fetchFpzw_content;
      break;
    default:
      new Error("invaild url or type");

      return fn(url);
  }
};

const fetchChapterList = fetchContentContainer(hostName);
```

## 构建 server

需要的包

```js
const Koa = require("koa");
const cors = require("koa2-cors"); //跨域
const bodyParser = require("koa-bodyparser"); //处理post数据
const Router = require("koa-router"); //导入router
```

### 数据获取方式

#### get 方式

get 方式的数据通过 ctx.query 直接获取

```js
const { keyword } = ctx.query;
```

#### post 方式

post 方式 需要借助 `koa-bodyparser`包

```js
//index.js
const bodyPaser = require("koa-bodyparser");
server.use(bodyParser());

//在相关js文件中使用
const userInfo = ctx.request.body;
```

## 爬取注意事项

- twoK 的搜索页面 没显示图片，需要去章节列表页获取，

所以将图片获取更改为章节列表页获取

- 使用 Promise.race 可能会导致正确的列表，没有竞争过错误的
  解决方案：
  默认全部搜索，分 tab 栏展示，tab 栏可以滑动。
  可以指定某个网站
