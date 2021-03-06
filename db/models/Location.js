module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        longitude: { type: DataTypes.STRING, unique: true, allowNull: true },
        latitude: { type: DataTypes.STRING, unique: true, allowNull: true },
    });

    Location.associate = (models) => {
        Location.belongsTo(models.UserLocation, { constraints: false });
    };

    return Location;
}