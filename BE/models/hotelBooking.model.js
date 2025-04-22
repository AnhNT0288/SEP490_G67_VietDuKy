module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "HotelBooking",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            booking_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            hotel_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "hotel_booking",
            timestamps: false,
        }
    );
};
