const mysql = require('mysql2/promise');
const config = require('./config');

async function initializeDatabase() {
  try {
    // Tạo kết nối không có database
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });

    // Tạo database nếu chưa tồn tại
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database initialized successfully');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

module.exports = initializeDatabase; 