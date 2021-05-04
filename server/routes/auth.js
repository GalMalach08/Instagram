// modules require
const express = require('express')
const router = new express.Router()
// files, functions, middleware require
const db = require('../db/models')
const isAuth = require('../middleware/auth')


// Sign up user
router.post('/signup', async (req, res) => {
try {
    const { firstname, lastname, username, password, admin ,token } = req.body
    const user = await db.User.findOne({ where: { username } })
    if(user) return res.send({ succsess: false, error: 'User name already in use, please choose new one'})
    const newUser = await db.User.create({ firstname, lastname, username, password, admin })
    req.session.userId = newUser.id

    const returnedUser =  await db.User.findOne({ 
        where: { username },
        include: [db.Follow]
        })
        
    res.send({ user: returnedUser })
} catch (error) {
    console.log(error);
}
})

// Log in user 
router.post('/login',  async (req, res) => {
    const { username, password } = req.body
    const user =  await db.User.findOne( { 
        where: { username },
        include: [db.Follow]
        })
    if(!user) return res.send({success: false, error:'One or more of the identification fields is incorrect, please try again'})
    if(user.password === password) {
        req.session.userId = user.id
        return res.send({ success: true, user })
    } else {
        return res.send({success: false, error:'One or more of the identification fields is incorrect, please try again'})
    } 
})

router.get('/allusers',  async (req, res) => {  
    User.findAll().then(res => console.log(res)).catch(err => console.log(err))
})

// Checks if the user is authenticated
router.get('/isauth',isAuth, (req, res) => {
    res.send({ success: true })
})

// Logout the user
router.get('/logout',isAuth, (req, res) => {
    req.session.destroy()
    res.send('logout')
})

module.exports = router
