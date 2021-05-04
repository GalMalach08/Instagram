const isAuth = (req,res,next) => {
    if(req.session.userId) {
        console.log('auth')
        req.userId = req.session.userId
        next()
    } else {
        console.log('not auth')
        res.send({ success: false })
    }
}

module.exports = isAuth