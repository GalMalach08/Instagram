module.exports = (sequelize, DataTypes) => {
    const Vacation = sequelize.define("Vacation", {
        description: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        imageName: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        start_date: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        end_date: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        price:{
            type: DataTypes.STRING,
            allowNull: false 
        }  
    },{
            timestamps: false
        })
        Vacation.associate = models => {
            Vacation.hasMany(models.Follow, { onDelete: 'cascade', hooks:true })
    }
    return Vacation
}
