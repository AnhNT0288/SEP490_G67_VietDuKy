module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "Restaurant",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name_restaurant: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address_restaurant: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            location_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            tableName: "restaurant",
            timestamps: false,
        }
    );
};
