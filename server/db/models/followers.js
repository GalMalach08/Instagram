module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define("Followers", {
        follower_id:{
            type: DataTypes.INTEGER,
         }
    },{
            timestamps: false
        })
        Followers.associate = models => {
        Followers.belongsTo(models.User, { foreignKey:{allowNull: false} })

    }
    return Followers
}
