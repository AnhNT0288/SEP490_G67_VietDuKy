const { Sequelize, DataTypes } = require("sequelize");
const config = require("../db/config.js");

// Khởi tạo Sequelize với cấu hình từ `config.js`
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false, // Tắt log query SQL
});

// Kiểm tra kết nối
sequelize
    .authenticate()
    .then(() => console.log("Connected to MySQL successfully"))
    .catch((error) => console.error("Unable to connect to the database:", error));

// Import các model
const Tour = require("./tour.model")(sequelize, Sequelize);
const User = require("./user.model")(sequelize);
const Customer = require("./customer.model")(sequelize);

// Đối tượng `db` để chứa Sequelize và Models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Tour = Tour;
db.User = User;
db.Customer = Customer;

module.exports = db;
