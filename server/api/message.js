module.exports = (router, crud) => {
    router.get('/getMessages', (req, res) => {
        if (req.session.userInfo) {
            const { selType, to_id } = req.query;
            let type;
            switch (selType) {
                case 'system':
                    type = 0;
                    break;
                case 'comm':
                    type = 1;
                    break;
                case 'support':
                    type = 2;
                    break;
            }
            // 把所有未读消息改成已读
            crud("UPDATE `messages` SET is_read=1 WHERE to_id=?", [to_id], () => {
                let obj = { ...req.session.userInfo };
                obj.unReadCount = 0;
                req.session.userInfo = { ...obj };
                // 如果type为undefined，说明是全部消息
                if (type >= 0) {
                    crud("SELECT * FROM `messages` WHERE " + `type=${type} AND` + " state=? AND to_id=? ORDER BY created_time DESC", [0, to_id], data => {
                        if (type !== 0) {
                            for (let i = 0; i < data.length; i++) {
                                crud("SELECT `user_nickName` FROM `users` WHERE user_id=?", [data[i].from_id], userData => {
                                    data[i].from_username = userData[0].user_nickName;
                                })
                            }
                        }
                        setTimeout(() => {
                            res.json({
                                status: 0,
                                lists: data,
                                userInfo: obj
                            })
                        }, 300)
                    })
                } else {
                    crud("SELECT * FROM `messages` WHERE  state=? AND to_id=? ORDER BY created_time DESC", [0, to_id], data => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].type !== 0) {
                                crud("SELECT `user_nickName` FROM `users` WHERE user_id=?", [data[i].from_id], userData => {
                                    data[i].from_username = userData[0].user_nickName;
                                })
                            }
                        }
                        setTimeout(() => {
                            res.json({
                                status: 0,
                                lists: data,
                                userInfo: obj
                            })
                        }, 300)

                    })
                }

            })
        } else {
            res.json({
                status: 1,
                errCode: 0
            });
        }

    })
}