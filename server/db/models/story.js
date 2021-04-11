module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define("Story", {
        photo: {
            type: DataTypes.STRING 
        }
    },{
            timestamps: false
        })
        Story.associate = models => {
        Story.belongsTo(models.User, { foreignKey:{allowNull: false} })
    }
    return Story
}
