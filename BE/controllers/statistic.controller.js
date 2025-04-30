const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const Tour = db.Tour;
const Booking = db.Booking;
const TravelTour = db.TravelTour;
const Service = db.Service;
const User = db.User;
const Feedback = db.Feedback;
const Passenger = db.Passenger;
const TravelGuide = db.TravelGuide;

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
            include: [
                {
                    model: Feedback,
                    as: 'feedback',
                    attributes: ['rating', 'description_feedback', 'feedback_album']
                },
                {
                    model: db.TravelTour,
                    as: 'TravelTours',
                    attributes: ['id', 'start_day', 'end_day', 'status']
                }
            ],
            attributes: [
                'id',
                'name_tour',
                'code_tour',
                'album',
                'rating_tour',
                [db.Sequelize.fn('COUNT', db.Sequelize.fn('DISTINCT', db.Sequelize.col('TravelTours.id'))), 'travel_tour_count'],
                [db.Sequelize.fn('COUNT', db.Sequelize.fn('DISTINCT', db.Sequelize.col('feedback.feedback_id'))), 'feedback_count'],
            ],
            group: ['Tour.id'],
            order: [['rating_tour', 'DESC']],
            limit: 4,
            subQuery: false
        });

        // 4 Tour có rating thấp nhất
        const lowestRatedTours = await Tour.findAll({
            include: [
                {
                    model: Feedback,
                    as: 'feedback',
                    attributes: ['rating', 'description_feedback', 'feedback_album']
                },
                {
                    model: db.TravelTour,
                    as: 'TravelTours',
                    attributes: ['id', 'start_day', 'end_day', 'status']
                }
            ],
            attributes: [
                'id',
                'name_tour',
                'code_tour',
                'album',
                'rating_tour',
                [db.Sequelize.fn('COUNT', db.Sequelize.fn('DISTINCT', db.Sequelize.col('TravelTours.id'))), 'travel_tour_count'],
                [db.Sequelize.fn('COUNT', db.Sequelize.fn('DISTINCT', db.Sequelize.col('feedback.feedback_id'))), 'feedback_count'],
            ],
            group: ['Tour.id'],
            order: [['rating_tour', 'ASC']],
            limit: 4,
            subQuery: false
        });

        // Format lại dữ liệu trả về
        const formattedTopTours = topTours.map(tour => {
            const tourData = tour.get({ plain: true });
            return {
                ...tourData,
                travel_tour_count: parseInt(tourData.travel_tour_count),
                feedback_count: parseInt(tourData.feedback_count),
                feedbacks: tour.feedback.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                }))
            };
        });

        const formattedLowestRatedTours = lowestRatedTours.map(tour => {
            const tourData = tour.get({ plain: true });
            return {
                ...tourData,
                travel_tour_count: parseInt(tourData.travel_tour_count),
                feedback_count: parseInt(tourData.feedback_count),
                feedbacks: tour.feedback.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                }))
            };
        });

        // Danh sách Hướng dẫn viên và đánh giá
        const guides = await TravelGuide.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'displayName', 'email', 'avatar']
                },
                {
                    model: Feedback,
                    as: 'Feedbacks',
                    attributes: ['feedback_id', 'rating', 'description_feedback', 'feedback_album']
                },
                {
                    model: db.GuideTour,
                    as: 'GuideTours',
                    where: {
                        status: 1
                    },
                    required: false
                }
            ],
            attributes: [
                'id',
                'first_name',
                'last_name',
                'email',
                'number_phone',
                'gender_guide',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('GuideTours.id')), 'approved_tour_count'],
                [db.Sequelize.fn('AVG', db.Sequelize.col('Feedbacks.rating')), 'average_rating']
            ],
            group: ['TravelGuide.id', 'user.id'],
            order: [[db.Sequelize.literal('approved_tour_count'), 'DESC']],
            limit: 4,
            subQuery: false
        });

        // Format lại dữ liệu guides
        const formattedGuides = guides.map(guide => {
            const guideData = guide.get({ plain: true });
            return {
                ...guideData,
                approved_tour_count: parseInt(guideData.approved_tour_count) || 0,
                average_rating: parseFloat(guideData.average_rating) || 0,
                feedbacks: guide.Feedbacks.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                }))
            };
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
                top_tours: formattedTopTours,
                lowest_rated_tours: formattedLowestRatedTours,
                guides: formattedGuides,
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
