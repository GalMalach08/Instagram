module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: true 
        }
    },{
        timestamps: false
    })
    
    User.associate = models => {
        User.hasMany(models.Follow)
       
    }
    return User
}
