module.exports = (sequelize, Sequelize) => {
    const ChatHistory = sequelize.define("chat_history", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        question: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        answer: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return ChatHistory;
}; 