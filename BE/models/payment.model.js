module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "Payment",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            booking_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            transactionCode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "payment",
            timestamps: true,
        }
    );
};
