module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define("Follow", {
    },{
            timestamps: false
        })
        Follow.associate = models => {
            Follow.belongsTo(models.Vacation, { foreignKey:{ allowNull: false },  onDelete: 'cascade' })
            Follow.belongsTo(models.User, { foreignKey:{ allowNull: false } })
    }
    return Follow
}
