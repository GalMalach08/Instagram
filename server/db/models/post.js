// const Sequelize = require('sequelize')
// const db = require('../index')


// const Posts = db.define('post', {
//     publisher: Sequelize.STRING,
//     photo: Sequelize.STRING,
//     likes: Sequelize.NUMBER,
//     content: Sequelize.STRING,
//     owner_id: {
//         type: Sequelize.INTEGER,
//         required: true,
//         allowNull: false,
        
//     }
// },{
//     timestamps: false
// })
// Posts.associate = models => {
//     console.log(models);
//     Post.belongsTo(models.User, { 
//         foreignKey: { allowNull: false },
//         ondelete:'cascade' 
//     })
// }
// module.exports = Posts



module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        photo: {
            type: DataTypes.STRING 
        },
        likes: {
            type: DataTypes.INTEGER                     
        },
        content: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING
        }
    },{
            timestamps: false
        })
    Post.associate = models => {
        Post.hasMany(models.Comment)
        Post.hasMany(models.Like, { onDelete:"cascade"}) 
        Post.belongsTo(models.User, { foreignKey:{allowNull: false} })

    }
    return Post
}




















// class Post extends Model {}
// Post.init({
    // publisher: DataTypes.STRING,
    // photo: DataTypes.STRING,
    // likes: DataTypes.NUMBER,
    // title: DataTypes.STRING
    // comments: DataTypes.ARRAY(DataTypes.STRING),
// }, { sequelize, modelName: 'post' })

// // Post.associate = models => {
// //     Post.hasOne(models.User, {
// //          ondelete: 'cascade'
// //         })
// //     Post.belongsTo(models.User, {
// //         foreignKey:{ allowNull:false }
// //     })
// // }


// const createPost = async ({ publisher, photo, likes, title, comments }) => {
//     try {
//         await sequelize.sync()
//         const post = await Post.create({
//             publisher,
//             photo,
//             // likes,
//             title,
//             // comments
//         })
//         return post
//     } catch (error) {
//         console.log('Err', error);
//     }
  
//   }

//   const getAllPosts = async () => {
//     const posts = await Post.findAll()
//     return posts
//   }

//   const getPostsByUser = async (id) => {
//     const post = await Post.findOne({id})
//     return post
//   }

// module.exports = {
//     createPost,
//     getAllPosts,
//     getPostsByUser
// }



// attributes: ['username']