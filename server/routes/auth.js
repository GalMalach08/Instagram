// modules require
const path = require('path')
const fetch = require('node-fetch')
const express = require('express')
const bcrypt = require('bcrypt')
const router = new express.Router()
require('dotenv').config({path: `${__dirname}/../../.env`})
// files, functions, middleware require
const { cloudinary } = require('../utils/cloudinary')
const db = require('../db/models')
const { isPhotoValid }  = require('../utils/photoValidation')
const isAuth = require('../middleware/auth')

const validateHuman = async (token) => {
    const secret = '6LfruZ4aAAAAAPMQCPU2o2noYjKfOniKxS26yNWr'
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    { method: 'POST'})
    const data = await response.json()
    return data.success

}


// Sign up user
router.post('/signup', async (req, res) => {
try {
    const { username, password, photo, fileName, token } = req.body
    const human = await validateHuman(token)
    if(!human) return res.send({ error: 'Please, your not fooling us bot!' })
    const user = await db.User.findOne({ where: { username } })
    if(user) return res.send({ succsess: false, error: 'User name already in use, please choose new one'})
    const photoValidation = isPhotoValid(fileName)
    if(!photoValidation)  return res.send({ succsess: false, error: 'Please upload images only'})
    const uploadedResponse = await cloudinary.uploader.upload(photo, { 
        upload_preset: 'ml_default',
        fetch_format: "jpg",
    })
    const profile = uploadedResponse.public_id
    const profileUrl = uploadedResponse.url
    const newUser = await db.User.create({ username, password, profile, profileFileName: fileName, profileDescription:'', profileUrl })
    req.session.userId = newUser.id

    const returnedUser =  await db.User.findOne({ 
        where: { username },
        include: [db.Followers, db.Following]
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
        include: [db.Followers, db.Following]
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

router.get('/isauth',isAuth, (req, res) => {
    res.send({ success: true })
})
router.get('/logout',isAuth, (req, res) => {
    req.session.destroy()
    res.send('logout')
})

module.exports = router







// Sign up user
// router.post('/signup', upload.single('photo'), async (req, res) => {
//   const photo = req.file.buffer
//   const { username, password } = req.body
//   const user = await db.User.create({ username, password, profile:photo })
//   req.session.userId = user.id
//   res.send({ user })
// })