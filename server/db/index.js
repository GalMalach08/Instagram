const { Sequelize } = require('sequelize')
module.exports = new Sequelize ('instagram','root', '',{
    host:'localhost',
    dialect:'mysql'
})