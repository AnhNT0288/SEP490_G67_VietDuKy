module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "Booking",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            discount_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            travel_tour_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            booking_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            number_adult: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            number_children: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            number_toddler: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            number_newborn: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            total_cost: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0, // 0: Not Paid, 1: Half Paid, 2: Paid, 3: Canceled, 4: Refunded, 5: Completed, 6: Expired
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            voucher_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            note: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            booking_code: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "booking", // Đảm bảo tên bảng khớp với DB
            timestamps: true, // Không dùng createdAt và updatedAt
        }
    );
};
