const express = require('express')
const router = new express.Router()
const db = require('../db/models')


// Create follow
router.post('/', async (req, res) => {
  try {
    const follow = await db.Follow.create(req.body)
    res.send({ follow })
  } catch(err) {
    console.log(err)
  } 
})

// Make unfollow
router.post('/unfollow', async (req, res) => {
    try {
        const { UserId, VacationId } = req.body
        const follow = await db.Follow.destroy({ 
            where: {
                UserId ,
                VacationId    
            }
        })
        res.send({ follow })
    } catch(err) {
      console.log(err)
    } 
  })

module.exports = router
