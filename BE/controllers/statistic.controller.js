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
const GuideTour = db.GuideTour;

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
            attributes: [
                'id',
                'name_tour',
                'code_tour',
                'album',
                'rating_tour'
            ],
            order: [['rating_tour', 'DESC']],
            limit: 4
        });

        // Lấy travel tours cho top tours
        const topTourIds = topTours.map(tour => tour.id);
        const topTourTravelTours = await TravelTour.findAll({
            where: {
                tour_id: {
                    [Op.in]: topTourIds
                }
            },
            attributes: ['id', 'start_day', 'end_day', 'status', 'tour_id']
        });

        // Lấy feedback cho top tours
        const topTourFeedbacks = await Feedback.findAll({
            where: {
                tour_id: {
                    [Op.in]: topTourIds
                }
            },
            attributes: ['feedback_id', 'rating', 'description_feedback', 'feedback_album', 'tour_id']
        });

        // 4 Tour có rating thấp nhất
        const lowestRatedTours = await Tour.findAll({
            attributes: [
                'id',
                'name_tour',
                'code_tour',
                'album',
                'rating_tour'
            ],
            order: [['rating_tour', 'ASC']],
            limit: 4
        });

        // Lấy travel tours cho lowest rated tours
        const lowestRatedTourIds = lowestRatedTours.map(tour => tour.id);
        const lowestRatedTourTravelTours = await TravelTour.findAll({
            where: {
                tour_id: {
                    [Op.in]: lowestRatedTourIds
                }
            },
            attributes: ['id', 'start_day', 'end_day', 'status', 'tour_id']
        });

        // Lấy feedback cho lowest rated tours
        const lowestRatedTourFeedbacks = await Feedback.findAll({
            where: {
                tour_id: {
                    [Op.in]: lowestRatedTourIds
                }
            },
            attributes: ['feedback_id', 'rating', 'description_feedback', 'feedback_album', 'tour_id']
        });

        // Format lại dữ liệu trả về
        const formattedTopTours = topTours.map(tour => {
            const tourData = tour.get({ plain: true });
            const tourFeedbacks = topTourFeedbacks.filter(feedback => feedback.tour_id === tour.id);
            const tourTravelTours = topTourTravelTours.filter(tt => tt.tour_id === tour.id);
            return {
                ...tourData,
                travel_tour_count: tourTravelTours.length,
                feedback_count: tourFeedbacks.length,
                feedbacks: tourFeedbacks.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                })),
                TravelTours: tourTravelTours
            };
        });

        const formattedLowestRatedTours = lowestRatedTours.map(tour => {
            const tourData = tour.get({ plain: true });
            const tourFeedbacks = lowestRatedTourFeedbacks.filter(feedback => feedback.tour_id === tour.id);
            const tourTravelTours = lowestRatedTourTravelTours.filter(tt => tt.tour_id === tour.id);
            return {
                ...tourData,
                travel_tour_count: tourTravelTours.length,
                feedback_count: tourFeedbacks.length,
                feedbacks: tourFeedbacks.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                })),
                TravelTours: tourTravelTours
            };
        });

        // Danh sách Hướng dẫn viên và đánh giá
        const guides = await TravelGuide.findAll({
            attributes: [
                'id',
                'first_name',
                'last_name',
                'email',
                'number_phone',
                'gender_guide'
            ],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'displayName', 'email', 'avatar']
                }
            ]
        });

        // Lấy feedback cho guides
        const guideIds = guides.map(guide => guide.id);
        const guideFeedbacks = await Feedback.findAll({
            where: {
                travel_guide_id: {
                    [Op.in]: guideIds
                }
            },
            attributes: ['feedback_id', 'rating', 'description_feedback', 'feedback_album', 'travel_guide_id']
        });

        // Lấy guide tours cho guides
        const guideTours = await GuideTour.findAll({
            where: {
                travel_guide_id: {
                    [Op.in]: guideIds
                },
                status: 1
            },
            attributes: ['id', 'travel_guide_id']
        });

        // Format lại dữ liệu guides
        const formattedGuides = guides.map(guide => {
            const guideData = guide.get({ plain: true });
            const guideTourList = guideTours.filter(gt => gt.travel_guide_id === guide.id);
            const guideFeedbackList = guideFeedbacks.filter(feedback => feedback.travel_guide_id === guide.id);
            
            const averageRating = guideFeedbackList.length > 0 
                ? guideFeedbackList.reduce((acc, curr) => acc + curr.rating, 0) / guideFeedbackList.length 
                : 0;

            return {
                ...guideData,
                approved_tour_count: guideTourList.length,
                average_rating: parseFloat(averageRating.toFixed(1)),
                feedbacks: guideFeedbackList.map(feedback => ({
                    rating: feedback.rating,
                    description: feedback.description_feedback,
                    album: feedback.feedback_album ? JSON.parse(feedback.feedback_album) : []
                }))
            };
        });

        // Sắp xếp guides theo số tour đã được duyệt
        formattedGuides.sort((a, b) => b.approved_tour_count - a.approved_tour_count);
        // Lấy top 4 guides
        const topGuides = formattedGuides.slice(0, 4);

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
                guides: topGuides,
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
