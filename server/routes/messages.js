const express = require('express')
const router = new express.Router()
const db = require('../db/models')
const { Op } = require("sequelize")


// Create message
router.post('/',async (req, res) => {
    const message = await db.Message.create( req.body )
    res.send({ message })
})

// Get all user's messages
router.post('/conversation',async (req, res) => {
    try {
        const { UserId, partnerId } = req.body
       
        const messages = await db.Message.findAll({
            where: { 
                UserId,
                [Op.or]: [
                   { reciver_id: partnerId },
                   { sender_id: partnerId }
                 ] 
            }
        })
        res.send({ messages })
    } catch(err) {
        console.log(err)
    }
  
})


module.exports = router