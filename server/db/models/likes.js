module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        number: {
            type: DataTypes.STRING 
        }
    },{
            timestamps: false
        })
        Like.associate = models => {
            Like.belongsTo(models.Post, { foreignKey:{allowNull: false} })
            Like.belongsTo(models.User, { foreignKey:{allowNull: false} })
    }
    return Like
}
