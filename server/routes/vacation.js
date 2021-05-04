const express = require('express')
const router = new express.Router()
const db = require('../db/models')
const { Op } = require("sequelize")
const { cloudinary } = require('../utils/cloudinary')
const { isPhotoValid } = require('../utils/photoValidation')

// Create vacation
router.post('/', async (req, res) => {
  try {
    const { image, imageName } = req.body
    const photoValidation = isPhotoValid(imageName)
    if(!photoValidation)  return res.send({ succsess: false, error: 'Please upload images only'})
    const uploadedResponse = await cloudinary.uploader.upload(image, { 
        upload_preset: 'ml_default',
        fetch_format: 'jpg',
    })
    const imageUrl = uploadedResponse.url
    const vacation = await db.Vacation.create({...req.body, image: imageUrl})
    const resVacation =  await db.Vacation.findOne({
      where: {
        id: vacation.id
      },
      include: [db.Follow]        
  })
    res.send({ vacation: resVacation })
  } catch(err) {
    console.log(err)
  } 
})

// Get all vacations
router.get('/',async (req, res) => {
  try {
    const vacations = await db.Vacation.findAll({
      include: [db.Follow]        
  })
  res.send({ vacations })
  }catch(err) {
    console.log(err)
  }
})

// Get vacation by his id
router.get('/:id',async (req, res) => {
    const { id } = req.params
    const vacation = await db.Vacation.findOne({
        where: { id },
        include: [db.Follow]
    })
    res.send({ vacation })
})


// Update vacation
router.patch('/', async (req, res) => {
  try {
      const { id, destination, description, start_date, end_date, image, imageName, price } = req.body
      const vacation = await db.Vacation.findOne({ where: { id } })
      if(image) {
        const photoValidation = isPhotoValid(imageName)
        if(!photoValidation)  return res.send({ success: false, error: 'Please upload images only'})
        const uploadedResponse = await cloudinary.uploader.upload(image, { 
            upload_preset: 'ml_default',
            fetch_format: "jpg",
        })
        vacation.image = uploadedResponse.url
        vacation.imageName = imageName
    }
     
      vacation.destination = destination
      vacation.description = description
      vacation.start_date = start_date
      vacation.end_date = end_date
      vacation.price = price
      await vacation.save()
      const updatedVacation = await db.Vacation.findOne({ where: { id } , include: [db.Follow] })
      res.send({ vacation: updatedVacation })
  } catch (error) {
     console.log(error) 
  }  
})

// Delete vacation 
router.delete('/', async (req, res) => {
  try {
    console.log('here');
      const { id } = req.body
      await db.Vacation.destroy({
        where : { id }
    })
    res.send({ success: true})
  } catch (error) {
     console.log(error) 
  }  
})

// Search vacations
router.get('/search/:search',async (req, res) => {
  try {
    const { value, type } = JSON.parse(req.params.search)
    if( type === 'General') {
      const vacations = await db.Vacation.findAll({
        where: {
          [Op.or]: [
            { start_date: { 
              [Op.like]: `%${value}%` 
            }},
            { end_date: { 
              [Op.like]: `%${value}%` 
            }},
            { description: { 
              [Op.like]: `%${value}%` 
            }},
            { destination: { 
              [Op.like]: `%${value}%` 
            }},
            { price: { 
              [Op.like]: `%${value}%` 
            }},
          ]
      },
      include:[db.Follow]   
    })
    res.send({ vacations })
    } else if( type === 'Dates') {
      let { startDate, endDate } = value
      let [startDateValue, endDateValue] = ['','']
      startDateValue = startDate.split('-').reverse()
      startDateValue = `${startDateValue[0].substring(0,2)}/${startDateValue[1]}/${startDateValue[2]}`
      endDateValue = endDate.split('-').reverse()
      endDateValue = `${endDateValue[0].substring(0,2)}/${endDateValue[1]}/${endDateValue[2]}`
      const vacations = await db.Vacation.findAll({
        where: {
          [Op.or]: [
            { start_date: { 
              [Op.like]: `%${startDateValue}%` 
            }},
            { end_date: { 
              [Op.like]: `%${endDateValue}%` 
            }},
          ]
        },
        include:[db.Follow] 
      })
      res.send({ vacations })
    } else {
      const vacations = await db.Vacation.findAll({
        where: {
          [type]: {
            [Op.like]: `%${value}%` 
          }
        },
        include:[db.Follow] 
       })
       res.send({ vacations })
    }


  }catch(err) {
    console.log(err)
  }
})

module.exports = router
