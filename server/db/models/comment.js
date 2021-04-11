module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        time: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.STRING
        }
    })
    Comment.associate = models => {
        Comment.belongsTo(models.User, { foreignKey:{allowNull: false} })
        Comment.belongsTo(models.Post, { foreignKey:{allowNull: false} })
    }
    return Comment
}
