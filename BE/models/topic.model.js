module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define(
        "Topic", 
        {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "topic",
            timestamps: false,
        }
    );

    return Topic;
};
