const { Sequelize } = require('sequelize')
module.exports = new Sequelize ('heroku_4b42da28d9a6542','bd5ee7c25761cf', 'fc9bf5ed',{
    host:'eu-cdbr-west-01.cleardb.com',
    dialect:'mysql'
})