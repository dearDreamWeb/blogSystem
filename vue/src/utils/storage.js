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
        return JSON.parse(this.storage.getItem(key));
    }

    /**
     * 新建数据
     * @param {String} key  要新建的数据的key值
     * @param {String,Object,Array} val  要新建的数据的value值
     */
    this.setItem = function (key, val) {
        return this.storage.setItem(key, JSON.stringify(val));
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