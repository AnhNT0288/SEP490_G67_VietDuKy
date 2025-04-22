module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "DiscountService",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            status: {
                type: Sequelize.INTEGER, //0: Chưa duyệt, 1: Đã duyệt
                allowNull: true,
            },
            program_discount_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            price_discount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            travel_tour_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "discount_service", // Tên bảng trong MySQL
            timestamps: false, // Không dùng createdAt và updatedAt
        }
    );
};
