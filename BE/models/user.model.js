module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facebookId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      reset_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_code_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      can_consult: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      fcm_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: true,
          fields: ["googleId"],
        },
        {
          unique: true,
          fields: ["facebookId"],
        },
      ],
    }
  );
};
