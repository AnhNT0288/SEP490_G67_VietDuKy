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
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            program_discount_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "discount_service", // Tên bảng trong MySQL
            timestamps: false, // Không dùng createdAt và updatedAt
        }
    );
};
