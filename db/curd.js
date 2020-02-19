// Curd.js
const stdout = require("shancw-stdout");
class Curd {
    /**
     * 子类构造传入对应的 Model 类
     *
     * @param Model
     */
    constructor(Model) {
        this.Model = Model;
    }

    /**
     * 使用 Model 的 静态方法 create() 添加 data
     *
     * @param obj 构造实体的对象
     * @returns {Promise}
     */
    create(obj) {
        return new Promise((resolve, reject) => {
            let entity = new this.Model(obj);
            this.Model.create(entity, (error, result) => {
                if (error) {
                    stdout.bgRed("mongodb:create error");

                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:create result");
                    console.log(result)
                    resolve(result);
                }
            });
        });
    }

    /**
     * 使用 Model save() 添加
     *
     * @param obj 构造实体的对象
     * @returns {Promise}
     */
    save(obj) {
        return new Promise((resolve, reject) => {
            let entity = new this.Model(obj);
            entity.save((error, result) => {
                if (error) {
                    stdout.bgRed("mongodb:save error");
                    stdout.red(error);
                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:save result");
                    console.log(result)
                    resolve(result);
                }
            });
        });
    }

    /**
     * 查询所有符合条件 data
     * 未查询到结果：// -> []
     *
     *
     * @param condition 查找条件
     * @param constraints
     * @returns {Promise}
     */
    findAll(condition, constraints) {
        return new Promise((resolve, reject) => {
            this.Model.find(condition, constraints ? constraints : null, (error, results) => {
                if (error) {
                    stdout.bgRed("mongodb:findAll error");

                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:findAll result");
console.log(results)
                    resolve(results);
                }
            });
        });
    }

    /**
     * 查找符合条件的第一条 data
     * 未找到 // -> null
     *
     * @param condition
     * @param constraints
     * @returns {Promise}
     */
    findOne(condition, constraints) {
        return new Promise((resolve, reject) => {
            this.Model.findOne(condition, constraints ? constraints : null, (error, results) => {
                if (error) {
                    stdout.bgRed("mongodb:findOne error");
                    stdout.red(error);
                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:findOne result");
                    console.log(results)
                    resolve(results);
                }
            });
        });
    }

    /**
     * 查找排序之后的第一条
     *
     * @param condition
     * @param orderColumn
     * @param orderType
     * @returns {Promise}
     */
    findOneByOrder(condition, orderColumn, orderType) {
        return new Promise((resolve, reject) => {
            this.Model.findOne(condition)
                .sort({ [orderColumn]: orderType })
                .exec(function(err, record) {
                    console.log(record);
                    if (err) {
                        reject(err);
                    } else {
                        resolve(record);
                    }
                });
        });
    }

    /**
     * 更新 datas
     *
     * @param condition 查找条件
     * @param updater 更新操作
     * @returns {Promise}
     */
    update(condition, updater) {
        return new Promise((resolve, reject) => {
            this.Model.update(condition, updater, (error, results) => {
                if (error) {
                    stdout.bgRed("mongodb:update error");
                    stdout.red(error);
                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:update result");
console.log(results)
                    resolve(results);
                }
            });
        });
    }

    /**
     * 移除 data
     *
     * @param condition 查找条件
     * @returns {Promise}
     */
    remove(condition) {
        return new Promise((resolve, reject) => {
            this.Model.remove(condition, (error, result) => {
                if (error) {
                    stdout.bgRed("mongodb:remove error");
                    stdout.red(error);
                    reject(error);
                } else {
                    stdout.bgMagenta("mongodb:remove result");
                    console.log(result)
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Curd;
