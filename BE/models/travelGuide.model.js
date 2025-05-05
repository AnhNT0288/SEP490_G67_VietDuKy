module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "TravelGuide",
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gender_guide: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            number_phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            birth_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            staff_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER, // 0: Not Active, 1: Active
                allowNull: false,
                defaultValue: 0,
            },
            group_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "travel_guide",
            timestamps: false,
        }
    );
};
