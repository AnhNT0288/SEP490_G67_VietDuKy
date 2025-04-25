const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const Tour = db.Tour;
const Booking = db.Booking;
const TravelTour = db.TravelTour;
const Service = db.Service;
const User = db.User;
const Feedback = db.Feedback;

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Doanh số hôm nay
        const todayRevenue = await Booking.sum('total_price', {
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                status: 'COMPLETED'
            }
        }) || 0;

        // Tổng doanh số trong tháng
        const monthlyRevenue = await Booking.sum('total_price', {
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                status: 'COMPLETED'
            }
        }) || 0;

        // Tổng số đặt dịch vụ
        const totalServices = await Service.count();

        // Tổng số khách hàng
        const totalCustomers = await User.count({
            where: {
                role_id: 3 // Giả sử role_id = 3 là khách hàng
            }
        });

        // Thống kê doanh thu theo tháng
        const monthlyStats = await Booking.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'revenue']
            ],
            where: {
                status: 'COMPLETED',
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
                [Sequelize.fn('AVG', Sequelize.col('Feedbacks.rating')), 'average_rating'],
                [Sequelize.fn('COUNT', Sequelize.col('Feedbacks.id')), 'total_reviews']
            ],
            group: ['Tour.id'],
            order: [
                [Sequelize.literal('average_rating'), 'DESC'],
                [Sequelize.literal('total_reviews'), 'DESC']
            ],
            limit: 4
        });

        // Danh sách Hướng dẫn viên và đánh giá
        const guides = await User.findAll({
            where: {
                role_id: 4 // Giả sử role_id = 4 là hướng dẫn viên
            },
            include: [{
                model: Feedback,
                as: 'guideFeedbacks',
                attributes: ['rating']
            }],
            attributes: [
                'id',
                'fullname',
                'avatar',
                [Sequelize.fn('COUNT', Sequelize.col('guideFeedbacks.id')), 'total_tours'],
                [Sequelize.fn('AVG', Sequelize.col('guideFeedbacks.rating')), 'average_rating']
            ],
            group: ['User.id']
        });

        res.json({
            success: true,
            data: {
                today_revenue: todayRevenue,
                monthly_revenue: monthlyRevenue,
                total_services: totalServices,
                total_customers: totalCustomers,
                monthly_stats: monthlyStats,
                top_tours: topTours,
                guides: guides
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