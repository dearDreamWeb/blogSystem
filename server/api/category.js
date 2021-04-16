module.exports = (router, crud) => {
    // 获取默认的分类
    router.get('/category/queryDefault', (req, res) => {
        crud("SELECT cate_id,cate_name FROM `category` WHERE state=? AND is_default=?", [0, 1], data => {
            res.json({
                state: 0,
                list: data
            })
        })
    });

    // 添加分类
    router.post('/category/add', (req, res) => {
        const { cate_name } = req.body;
        crud("SELECT * FROM `category` WHERE state=? AND cate_name=?", [0, cate_name], queryData => {
            if (queryData.length > 0) {
                if (queryData[0].is_default === 1) {
                    res.json({
                        state: 1,
                        msg: '该分类为默认分类，无需添加'
                    })
                } else {
                    crud("INSERT INTO `category` SET?", { cate_name }, () => {
                        crud("SELECT cate_id,cate_name FROM `category` WHERE state=? AND cate_name=?", [0, cate_name], data => {
                            res.json({
                                state: 0, 
                                cateData: queryData[0]
                            })
                        })
                    })
                }

            } else {
                res.json({
                    state: 0,
                    cateData: queryData[0]
                })
            }
        })
    })
}