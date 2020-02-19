const mongoose = require("mongoose");
const stdout = require("shancw-stdout");
const handler = require("./curd");
mongoose.connect("mongodb://localhost:27017/fiction");
const db = mongoose.connection;
db.once("open", () => {
    stdout.bgGreen("db connected!");
});
db.on("error", err => {
    stdout.bgRed("error\n");
    stdout.red(err);
});

//数据格式
const userSchema = mongoose.Schema({
    userName: String,
    passwd: String,
    location: String,
    books: [
        {
            title: String,
            author: String,
            img:String,
            update: String,
            desc: String,
            tags: [],
            chapterList: [
                {
                    title: String,
                    href: String
                }
            ],
            recentRead:{
                href:String,
                title:String,
            }
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = {
    dbUser: new handler(User),
    close: () => {
        db.close();
    }
};
