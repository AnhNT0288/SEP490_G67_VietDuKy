module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "Vehicle",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name_vehicle: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            plate_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            location_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        
        },
        {
            tableName: "vehicle",
            timestamps: false,
        }
    );
};
