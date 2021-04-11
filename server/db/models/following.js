module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define("Following", {
     followed_id:{
        type: DataTypes.INTEGER,
     }
    },{
            timestamps: false
        })
        Following.associate = models => {
            Following.belongsTo(models.User, { foreignKey:{allowNull: false} })

    }
    return Following
}
