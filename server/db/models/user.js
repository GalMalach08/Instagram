// const Sequelize = require('sequelize')
// const db = require('../index')

// const User = db.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     auto_increment: true, 
//     primaryKey: true
//   },
//   username: Sequelize.STRING,
//   password: Sequelize.STRING,
//   profile: Sequelize.STRING
// })

// User.associate = models => {
//   Post.hasMany(models.Posts, { ondelete:'cascade' })
// }
// module.exports = User


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        },
        profile: {
            type: DataTypes.STRING,
            required: true
        },
        profileFileName: {
            type: DataTypes.STRING,
            required: true
        },
        profileDescription: {
            type: DataTypes.STRING,
            required: true
        },
        profileUrl:{
            type: DataTypes.STRING
        },
        lastActive: {
            type: DataTypes.STRING
        },
        socketIdConnection: {
            type: DataTypes.STRING
        },
        room: {
            type: DataTypes.STRING
        }

    })
    
    User.associate = models => {
        User.hasMany(models.Post, { onDelete:"cascade"})
        User.hasMany(models.Followers, { onDelete:"cascade"})
        User.hasMany(models.Following, { onDelete:"cascade"})
        User.hasMany(models.Story, { onDelete:"cascade"})  
        User.hasMany(models.Like, { onDelete:"cascade"})  
    }
    return User
}























//  class User extends Model {}
// User.init({
//   username: DataTypes.STRING,
//   password: DataTypes.STRING,
//   profile: DataTypes.STRING
// }, { sequelize, modelName: 'user' })

// User.associate = models => {
//   User.hasMany(models.Post, { 
//     foreignKey: 'owner',
//     onDelete:'cascade' 
//   })
//   User.belongsTo(models.Post, {
//     foreignKey:{ allowNull:false }
// })
// }

// const signUp = async ({ username, password, profile }) => {
//     await sequelize.sync()
//     const user = await User.create({
//       username,
//       password,
//       profile
//     })
//     return user
//   }
//   const signIn = async ({ username, password }) => {
//     const user = await User.findOne({ where: { username }})
//     if(!user) return { success: false, error: 'User not found' }
//     if(user.password !== password)  return { success: false, error: 'User not found' }
//     else return { success: true, user }
//   }

//   const getUsers = async () => {
//     const users = await User.findAll()
//     return users
//   }

// module.exports = {
//     signUp,
//     signIn,
//     getUsers
// }



// attributes: ['username']