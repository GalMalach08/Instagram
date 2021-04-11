const express = require('express')
const router = new express.Router()
const db = require('../db/models')
const comment = require('../db/models/comment')
const isAuth = require('../middleware/auth')


// Create Comment
router.post('/',async (req, res) => {
    const { time, content, UserId, PostId } = req.body
    const comment = await db.Comment.create( { time, content, UserId, PostId })
    res.send({ comment })
})

// Get all comments by post id
// router.get('/:id',async (req, res) => {
//     const comments = await db.Comment.findAll({
//         where: { PostId: req.params.id }
//     })
   
//     const resObj = comments.map(comment => {
//         //tidy up the user data
//         return Object.assign(
//           {},
//           {
//             time: comment.time,
//             content: comment.content,
//             user: comment.UserId.map(post => {

//               //tidy up the post data
//               return Object.assign(
//                 {},
//                 {
//                   post_id: post.id,
//                   user_id: post.user_id,
//                   content: post.content,
   
//     res.send({ commentsArr })
// })

// // Get user's posts by his id
// router.get('/:id',async (req, res) => {
//     const posts = await db.Post.findAll({
//         where: { UserId: req.params.id }
//     })
//     res.send({ posts })
// })

module.exports = router