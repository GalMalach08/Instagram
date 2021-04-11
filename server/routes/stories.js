const express = require('express')
const router = new express.Router()
const db = require('../db/models')
const { cloudinary } = require('../utils/cloudinary')
const { isStoryValid } = require('../utils/photoValidation')


// Create a story 
router.post('/', async (req, res) => {
    const { photo, UserId, fileName } = req.body
    const storyValidation = isStoryValid(fileName)
    if(!storyValidation)  return res.send({ succsess: false, error: 'Please upload images and vides only'})
    const uploadedResponse = await cloudinary.uploader.upload(photo, { 
        upload_preset: 'ml_default'
    })
    const postPhoto = uploadedResponse.url
    const story = await db.Story.create( { photo: postPhoto, UserId })
    res.send({ story })
  })
  
  // Get all stories
  router.get('/', async (req, res) => {
    const stories = await db.Story.findAll({ 
      include: [{ model:db.User,
        include: [ db.Followers, db.Story ]
      }]
    })
    res.send({ stories })
  })
  
  module.exports = router
  