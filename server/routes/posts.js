
const express = require('express')
const router = new express.Router()
const db = require('../db/models')
const isAuth = require('../middleware/auth')
const { cloudinary } = require('../utils/cloudinary')
const { isPhotoValid } = require('../utils/photoValidation')

// Create post
router.post('/', async (req, res) => {
    const { photo, likes , content , UserId, date, fileName } = req.body
    const photoValidation = isPhotoValid(fileName)
    if(!photoValidation)  return res.send({ succsess: false, error: 'Please upload images only'})
    const uploadedResponse = await cloudinary.uploader.upload(photo, { 
        upload_preset: 'ml_default',
        fetch_format: 'jpg',
    })
    const postPhoto = uploadedResponse.url
    const post = await db.Post.create( {  content, photo: postPhoto, likes, UserId, date })
    res.send({ post })
})

// Get all posts
router.get('/',async (req, res) => {
    const postsArr = []
    const users = await db.User.findAll({
        include: [{ model:db.Followers, model: db.Following, model: db.Story, model: db.Post, include: [{all:true, include:[{all:true}]}]
        // include: [{all: true}]
            }]
            
    })
    const resObj = users.map(user => {

        //tidy up the user data
        return Object.assign(
          {},
          {
            publisher_id: user.id,
            publisher_username: user.username,
            publisher_profile: user.profile,
            stories: user.Story,
            posts: user.Posts.map(post => {

              //tidy up the post data
              return Object.assign(
                {},
                {
                    post_id: post.id,
                    post_photo: post.photo,
                    post_content: post.content,
                    post_date: post.date,
                    post_likes: post.Likes.map(like => {
                      return Object.assign(
                        {},
                        {
                          like_username: like.User.username,
                          like_userid : like.User.id
                        }
                      )
                    }),
                    post_comments: post.Comments.map(comment => {

                    //tidy up the comment data
                    return Object.assign(
                      {},
                      {
                        comment_id: comment.id,
                        time: comment.time,
                        commenter_id: comment.User.id,
                        commenter: comment.User.username,
                        commenter_profile: comment.User.profile,
                        content: comment.content
                      }
                    )
                  })
                }
                )
            })
          }
        )
      }) 
      res.json(resObj)
    })

// Get user's posts by his id
router.get('/:id',async (req, res) => {
    const postArr = []
    const posts = await db.Post.findAll({
        where: { UserId: req.params.id },
        include: [ { all:true,
          include: [{all:true }]
        }]
      
    })

    const user = await db.User.findOne({
      where: { id: req.params.id },
      include: [db.Followers, db.Following]
    })
   
       posts.forEach(post => {
        const obj = {
            postId: post.id,
            photo: post.photo,
            likes: post.Likes.length,
            content: post.content,
            date: post.date,
            owner_photo:user.profile,
            owner_username: user.username,
            publisher_description: user.profileDescription,
            comments: post.Comments
        }
        postArr.push(obj)
    })
    res.send({ postArr, numberOfFollowers:user.Followers.length , numberOfFollowing: user.Followings.length })
})


router.post('/like', async (req, res) => {
  const { id, add, UserId, PostId } = req.body 
  if(add) {
    const like = await db.Like.create({ UserId, PostId })
    res.send({message:'added', like})
  } else {
    const like = await db.Like.destroy({ where:{ UserId, PostId } })
    res.send({message:'removed', like})
  }
})

module.exports = router
