module.exports = (router,crud) => {
    router.get("/getCities",(req,res) => {
        crud("SELECT * FROM `china_city`",[],data=> {
            res.json({
                state: 0,
                cityData: data
            })
        })
    })
}