const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statistic.controller');

// Route để lấy thống kê tổng quan
router.get('/dashboard', statisticController.getDashboardStats);

module.exports = router; 