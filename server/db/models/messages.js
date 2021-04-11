module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
    content:{
        type: DataTypes.STRING,
    },
     reciver_id:{
        type: DataTypes.INTEGER,
     },
     sender_id:{
        type: DataTypes.INTEGER,
     },
    },{
            timestamps: false
        })
        Message.associate = models => {
            Message.belongsTo(models.User, { foreignKey:{allowNull: false} })

    }
    return Message
}
