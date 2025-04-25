const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const Tour = db.Tour;
const Booking = db.Booking;
const TravelTour = db.TravelTour;
const Service = db.Service;
const User = db.User;
const Feedback = db.Feedback;
const Passenger = db.Passenger;

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Doanh số hôm nay
        const todayRevenue = await Booking.sum('total_cost', {
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                },
            }
        }) || 0;

        // Doanh số tuần này
        const weeklyRevenue = await Booking.sum('total_cost', {
            where: {
                createdAt: {
                    [Op.between]: [startOfWeek, endOfWeek]
                },
            }
        }) || 0;

        // Tổng doanh số trong tháng
        const monthlyRevenue = await Booking.sum('total_cost', {
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
            }
        }) || 0;

        // Tổng số đặt dịch vụ
        const totalBookings = await Booking.count();

        // Tổng số khách hàng
        const totalCustomers = await Passenger.count();

        // Thống kê doanh thu theo tháng
        const monthlyStats = await Booking.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_cost')), 'revenue']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(today.getFullYear(), 0, 1) // Từ đầu năm
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
        });

        // Top 4 Tour được yêu thích
        const topTours = await Tour.findAll({
            include: [{
                model: Feedback,
                attributes: []
            }],
            attributes: [
                'id',
                'name_tour',
                'code_tour',
            ],
            group: ['Tour.id'],
            limit: 4
        });

        // Danh sách Hướng dẫn viên và đánh giá
        const guides = await User.findAll({
            where: {
                role_id: 4 // Giả sử role_id = 4 là hướng dẫn viên
            },
            group: ['User.id']
        });
        const feedbacks = await Feedback.findAll({
            include: [{
                model: Tour,
                as: 'tour',
            }],
        });

        res.json({
            success: true,
            data: {
                today_revenue: todayRevenue,
                weekly_revenue: weeklyRevenue,
                monthly_revenue: monthlyRevenue,
                total_bookings: totalBookings,
                total_customers: totalCustomers,
                monthly_stats: monthlyStats,
                top_tours: topTours,
                guides: guides,
                feedbacks: feedbacks
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu thống kê',
            error: error.message
        });
    }
}; 