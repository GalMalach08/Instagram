// modules require
const express = require('express')
const router = new express.Router()
require('dotenv').config({path: `${__dirname}/../../.env`})
const { Op } = require("sequelize")
// files, functions, middleware require
const db = require('../db/models')
const isAuth = require('../middleware/auth')
const { cloudinary } = require('../utils/cloudinary')
const { isPhotoValid }  = require('../utils/photoValidation')

// Get all users
router.get('/',  async (req, res) => {  
    db.User.findAll({
        include: [db.Post, db.Following, db.Followers]
    }).then(users => res.send({ users })).catch(err => console.log(err))
})

// Get user by id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const user = await db.User.findOne({ 
        where: { id } ,
        include: [ db.Following, db.Post,db.Followers]
    })
    res.send({ user })
})

// Get user followings
router.get('/follow/:id', async (req, res) => {
    const { id } = req.params
    const ableChatUsers = []
    const user = await db.User.findOne({ 
        where: { id } ,
        include: [ db.Followers, db.Following]
    })
    user.Followings.forEach(followed => {
        user.Followers.forEach(follower => {
            if(follower.follower_id === followed.followed_id) {
                ableChatUsers.push(follower.follower_id)
            }
        })
    })

    const obj =  ableChatUsers.map(user => {
    return Object.assign(
        {},
        {
           id:user
        })})
    
    const users = await db.User.findAll({
        where: {
            [Op.or]: [
               ...obj
            ]
          }
    })
    res.send({users})
})


// Get users by username
router.get('/users/:username', async (req, res) => {
    const { username } = req.params
    console.log(username);
    const users = await db.User.findAll({ 
        where: {
            username: { 
                [Op.like]: `${username}%` 
            }  
        } 
    })
    res.send({ users })
})

// Update user profile
router.patch('/', async (req, res) => {
    try {
        const { id, username, password, description, photo, fileName } = req.body
        const user = await db.User.findOne(
            { 
                where: { id } ,
                include: [db.Followers, db.Following]
            })
        username ? user.username = username: user.username
        password ? user.password = password: user.password
        description ? user.profileDescription = description: user.profileDescription
        if(photo) {
            const photoValidation = isPhotoValid(fileName)
            if(!photoValidation)  return res.send({ succsess: false, error: 'Please upload images only'})
            const uploadedResponse = await cloudinary.uploader.upload(photo, { 
                upload_preset: 'ml_default',
                fetch_format: "jpg",
            })
            user.profile = uploadedResponse.public_id
            user.profileFileName = fileName
        }
        const newUser = await user.save()
        console.log(newUser);
        res.send({ user: newUser })
    } catch (error) {
       console.log(error) 
    }  
})


// Add follower to user by his id
router.post('/follow', async (req, res) => {
    try {
        const { userWhoWantToFollow, userWhoGetsFollower } = req.body

        await db.Followers.create({
            UserId:userWhoGetsFollower,
            follower_id:userWhoWantToFollow
        })
        await db.Following.create({
         UserId:userWhoWantToFollow,
         followed_id: userWhoGetsFollower
     })
     res.send({ success: true })
    } catch(err) {
        res.send({error:'Unable to login please try again later'})
        console.log(err)
    }
})

// Unfollow user
router.post('/unfollow', async (req, res) => {
    try {
        const { userWhoWantstoUnfollow, userWhoGetsUnfollowed } = req.body
        await db.Followers.destroy({
            where : {  
                UserId:userWhoGetsUnfollowed,
                follower_id:userWhoWantstoUnfollow 
            }
           
        })
        await db.Following.destroy({
            where : { followed_id: userWhoGetsUnfollowed }
     })
     res.send({ success: true })
    } catch(err) {
        res.send({error:'Unable to login please try again later'})
        console.log(err)
    }
})



module.exports = router