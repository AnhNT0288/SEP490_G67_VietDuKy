module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "PaymentCard",
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
      card_number: {
        type: Sequelize.STRING,
        allowNull: false,
        indexes: [
          {
            unique: true,
            fields: ["card_number"],
          },
        ],
      },
      card_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      card_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "payment_card",
      timestamps: false,
    }
  );
};
