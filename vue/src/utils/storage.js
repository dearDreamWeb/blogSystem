function Store(webStorage) {
    if (webStorage !== "localStorage" && webStorage !== "sessionStorage") {
        throw new Error(` invalid parameter, parameter should be localStorage or sessionStorage`);
    }
    this.storage = webStorage === "localStorage" ? window.localStorage : window.sessionStorage;

    /**
     * 获取数据
     * @param {String} key  要获取的key值的数据
     */
    this.getItem = function (key) {
        let val = this.storage.getItem(key);
        if (typeof val === "object") {
            val = JSON.parse(val);
        }
        return val;
    }

    /**
     * 新建数据
     * @param {String} key  要新建的数据的key值
     * @param {String,Object,Array} val  要新建的数据的value值
     */
    this.setItem = function (key, val) {
        if (typeof val === "object") {
            val = JSON.stringify(val);
        }
        return this.storage.setItem(key, val);
    }

    /**
     * 删除某一项数据
     * @param {String} key 要删除key值的数据
     */
    this.removeItem = function (key) {
        if (!Object.prototype.hasOwnProperty.call(this.storage, key)) {
            return {
                state: 1,
                message: `删除失败，没有key值为${key}字段`
            };
        }
        this.storage.removeItem(key);
        return {
            state: 0,
            message: "删除成功"
        }
    }

    // 清除所有数据
    this.clear = function () {
        this.storage.clear();
    }
}
export default Store;