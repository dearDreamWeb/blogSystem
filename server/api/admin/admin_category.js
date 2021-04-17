module.exports = (router, crud) => {
    // 获取博客分类
    router.get('/admin/category/queryAll', (req, res) => {
        const { selectedValue, keyWord, currentPage, pageSize, sort_orderBy } = req.query;
        let sortOrderBy = sort_orderBy === "1" ? "ASC" : "DESC";
        let currentIndex = (currentPage - 1) * pageSize; // 开始索引的值
        // 有关键字的话，按照selectedValue判断搜索类型
        if (keyWord) {
            switch (selectedValue) {
                // 按博客分类ID查询
                case "0":
                    crud("SELECT * FROM `category` WHERE state=0 AND cate_id=?", [keyWord], data => {
                        res.json({
                            status: 0,
                            allCate: data,
                            total: data.length
                        });
                    })
                    break;
                // 按博客分类内容查询
                case "1":
                    crud("SELECT count(cate_id) FROM `category` WHERE state=0 AND cate_name LIKE '%" + keyWord + "%' ORDER BY is_default DESC, created_time " + sortOrderBy, [], cateTotal => {
                        let total = cateTotal[0]["count(cate_id)"];
                        crud("SELECT * FROM `category` WHERE state=0 AND cate_name LIKE '%" + keyWord + "%' ORDER BY is_default DESC, created_time " + sortOrderBy + " LIMIT ?,?", [currentIndex, Number(pageSize)], data => {
                            res.json({
                                status: 0,
                                allCate: data,
                                total
                            });
                        })
                    })

                    break;
            }
        } else {
            crud("SELECT count(cate_id) FROM `category` WHERE state=?", [0], cateTotal => {
                let total = cateTotal[0]["count(cate_id)"];
                crud("SELECT * FROM `category` WHERE state=0 ORDER BY is_default DESC, created_time " + sortOrderBy + " LIMIT ?,?", [currentIndex, Number(pageSize)], data => {
                    res.json({
                        status: 0,
                        allCate: data,
                        total
                    });
                })
            })
        }
    })

    // 修改博客分类的默认状态
    router.put('/admin/category/changeIsDefault', (req, res) => {
        const { cate_id, is_default } = req.query;
        let newIsDefault = is_default === "0" ? 1 : 0;
        crud("UPDATE `category` SET is_default=? WHERE cate_id=?", [newIsDefault, cate_id], () => {
            res.json({
                status: 0
            })
        })
    })

    // 删除分类，将删除的分类下的博客分类都改为其他分类
    router.delete('/admin/category/deleteCate', (req, res) => {
        const { cate_id } = req.query;
        crud("UPDATE `category` SET state=1 WHERE cate_id=?", [cate_id], () => {
            crud("UPDATE `post` SET post_tag=? WHERE post_tag=?",[7,cate_id],()=>{
                res.json({
                    status:0,
                    msg:'删除博客分类成功'
                })
            })
        })
    })
}