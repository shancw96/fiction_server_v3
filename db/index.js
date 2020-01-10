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
            update: String,
            desc: String,
            tags: [String],
            chapterList: [
                {
                    title: String,
                    href: String
                }
            ]
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = {
    dbHandler: new handler(User),
    close: () => {
        db.close();
    }
};
