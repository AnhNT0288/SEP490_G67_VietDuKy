const db = require("../models");
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;
const Booking = db.Booking;
const User = db.User;
const TravelGuide = db.TravelGuide;
const GuideTour = db.GuideTour;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const {Op, Sequelize} = require("sequelize");
const TravelGuideLocation = db.TravelGuideLocation;
const {NOTIFICATION_TYPE} = require("../constants");
const {sendRoleBasedNotification, sendNotificationToUser} = require("../utils/sendNotification");

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Lấy tất cả dữ liệu trong bảng travel tour
exports.getAllTravelTours = async (req, res) => {
    try {
        const {status} = req.query;

        // Tạo điều kiện where
        const whereCondition = {};
        if (status !== undefined) {
            whereCondition.status = status;
        }

        const travelTours = await TravelTour.findAll({
            where: whereCondition,
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    // attributes: ['id', 'name_tour', 'price_tour', 'day_number', 'rating_tour', 'max_people', 'image']
                },
            ],
            order: [["start_day", "ASC"]],
        });

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTours.map((travelTour) => {
            const travelTourData = travelTour.get({plain: true});
            return {
                ...travelTourData,
                tour: travelTourData.Tour || null,
            };
        });

        res.json({
            message: "Lấy danh sách tour thành công!",
            data: formattedTravelTours,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour!",
            error: error.message,
        });
    }
};

//Lấy thông tin travel tour theo ID
exports.getTravelTourById = async (req, res) => {
    try {
        const travelTourId = req.params.id;
        const travelTour = await TravelTour.findByPk(travelTourId, {
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }

        // Format lại dữ liệu trả về
        const formattedTravelTour = {
            ...travelTour.get({plain: true}),
            tour: {
                ...travelTour.Tour.get({plain: true}),
                start_location: travelTour.Tour.StartLocation || null,
                end_location: travelTour.Tour.EndLocation || null,
            },
        };

        res.json({
            message: "Lấy thông tin tour du lịch thành công!",
            data: formattedTravelTour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thông tin tour du lịch với id=" + req.params.id,
            error: error.message,
        });
    }
};

//Lấy thông tin travel tour theo tour_id
exports.getTravelTourByTourId = async (req, res) => {
    try {
        const tourId = req.params.id;
        const travelTour = await TravelTour.findAll({
            where: {tour_id: tourId},
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTour || travelTour.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tour du lịch!",
            });
        }

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTour.map((item) => {
            const travelTourData = item.get({plain: true});
            return {
                ...travelTourData,
                tour: {
                    ...travelTourData.Tour,
                    start_location: travelTourData.Tour?.startLocation || null,
                    end_location: travelTourData.Tour?.endLocation || null,
                },
            };
        });

        res.json({
            message: "Lấy thông tin tour du lịch thành công!",
            data: formattedTravelTours,
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Lỗi khi lấy thông tin tour du lịch với tour_id=" + req.params.id,
            error: error.message,
        });
    }
};

const calculateRequiredGuides = (max_people) => {
    if (!max_people || max_people <= 0) {
        throw new Error("Số lượng khách không hợp lệ!");
    }

    // Một hướng dẫn viên quản lý tối đa 15 khách
    const guideCapacity = 15;
    const fullGuides = Math.floor(max_people / guideCapacity);
    const remainingPeople = max_people % guideCapacity;

    // Nếu số người còn lại lớn hơn 10, thêm một hướng dẫn viên mới
    return remainingPeople > 10 ? fullGuides + 1 : fullGuides;
};

//Tạo travel tour mới
exports.createTravelTour = async (req, res) => {
    try {
        const {
            tour_id,
            start_day,
            end_day,
            price_tour,
            max_people,
            start_time_depart,
            end_time_depart,
            start_time_close,
            end_time_close,
            children_price,
            toddler_price,
        } = req.body;

        // Tính toán required_guides dựa trên max_people
        const required_guides = calculateRequiredGuides(max_people);

        if (
            !tour_id ||
            !start_day ||
            !end_day ||
            !price_tour ||
            !max_people ||
            !start_time_depart ||
            !end_time_depart ||
            !start_time_close ||
            !end_time_close ||
            !children_price ||
            !toddler_price
        ) {
            return res.status(400).json({message: "Thiếu thông tin bắt buộc!"});
        }

        const data = {
            tour_id,
            start_day,
            end_day,
            price_tour,
            max_people,
            start_time_depart,
            end_time_depart,
            start_time_close,
            end_time_close,
            children_price,
            toddler_price,
            required_guides,
            status: 0,
            active: 1,
        };
        const Tour = await db.Tour.findByPk(tour_id);
        if (!Tour) {
            return res.status(404).json({message: "Không tìm thấy tour!"});
        }
        /// Validate thời gian khởi hành và kết thúc
        if (start_time_depart >= end_time_depart) {
            return res.status(400).json({
                message:
                    "Thời gian khởi hành phải trước thời gian kết thúc cho ngày khởi hành!",
            });
        }
        if (start_time_close >= end_time_close) {
            return res.status(400).json({
                message:
                    "Thời gian khởi hành phải trước thời gian kết thúc cho ngày kết thúc!",
            });
        }

        //Validate ngày bắt đầu và ngày kết thúc
        if (start_day < Date.now()) {
            return res
                .status(400)
                .json({message: "Ngày bắt đầu phải ở tương lai!"});
        }
        if (end_day < start_day) {
            return res
                .status(400)
                .json({message: "Ngày kết thúc phải sau ngày bắt đầu!"});
        }

        //Validate giá tour và số người
        if (price_tour < 0) {
            return res.status(400).json({message: "Giá tour phải lớn hơn 0!"});
        }
        if (max_people < 0) {
            return res.status(400).json({message: "Số người phải lớn hơn 0!"});
        }

        const newTravelTour = await db.TravelTour.create(data);
        res.json({
            message: "Tạo tour du lịch mới thành công!",
            tour: newTravelTour,
        });
    } catch (error) {
        console.error("Lỗi khi thêm tour:", error);
        res.status(500).json({error: error.message});
    }
};

//Xóa travel tour theo ID
exports.deleteTravelTour = async (req, res) => {
    try {
        const travelTourId = req.params.id;

        // Tìm travel tour theo ID
        const travelTour = await TravelTour.findByPk(travelTourId);

        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }

        // Kiểm tra xem có booking nào liên quan đến travel tour này không
        const bookings = await db.Booking.findAll({
            where: {travel_tour_id: travelTourId},
        });

        if (bookings.length > 0) {
            return res.status(400).json({
                message: "Không thể xóa tour du lịch vì đã có booking liên quan!",
            });
        }

        // Xóa travel tour nếu không có booking
        await travelTour.destroy();
        res.json({message: "Xóa tour du lịch thành công!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Cập nhật thông tin travel tour theo ID
exports.updateTravelTour = async (req, res) => {
    try {
        const travelTourId = req.params.id;
        const travelTour = await TravelTour.findByPk(travelTourId);

        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }

        const {
            tour_id,
            start_day,
            end_day,
            price_tour,
            max_people,
            current_people,
            start_time_depart,
            end_time_depart,
            start_time_close,
            end_time_close,
            children_price,
            toddler_price,
            status,
            active,
        } = req.body;

        // Validate thời gian khởi hành và kết thúc
        if (start_time_depart >= end_time_depart) {
            return res.status(400).json({
                message:
                    "Thời gian khởi hành phải trước thời gian kết thúc cho ngày khởi hành!",
            });
        }
        if (start_time_close >= end_time_close) {
            return res.status(400).json({
                message:
                    "Thời gian khởi hành phải trước thời gian kết thúc cho ngày kết thúc!",
            });
        }

        // Validate thời gian kết thúc phải sau thời gian khởi hành
        if (start_day < Date.now()) {
            return res
                .status(400)
                .json({message: "Ngày bắt đầu phải ở tương lai!"});
        }
        if (end_day < start_day) {
            return res
                .status(400)
                .json({message: "Ngày kết thúc phải sau ngày bắt đầu!"});
        }

        // Validate giá tour
        if (price_tour < 0) {
            return res.status(400).json({message: "Giá tour phải lớn hơn 0!"});
        }

        // Nếu max_people được cập nhật, tính toán lại required_guides
        if (max_people !== undefined) {
            if (max_people <= 0) {
                return res
                    .status(400)
                    .json({message: "Số lượng khách không hợp lệ!"});
            }
            travelTour.required_guides = calculateRequiredGuides(max_people);
            travelTour.max_people = max_people;
        }

        if (tour_id !== undefined) travelTour.tour_id = tour_id;
        if (start_day !== undefined) travelTour.start_day = start_day;
        if (end_day !== undefined) travelTour.end_day = end_day;
        if (price_tour !== undefined) travelTour.price_tour = price_tour;
        if (max_people !== undefined) travelTour.max_people = max_people;
        if (current_people !== undefined)
            travelTour.current_people = current_people;
        if (start_time_depart !== undefined)
            travelTour.start_time_depart = start_time_depart;
        if (end_time_depart !== undefined)
            travelTour.end_time_depart = end_time_depart;
        if (start_time_close !== undefined)
            travelTour.start_time_close = start_time_close;
        if (end_time_close !== undefined)
            travelTour.end_time_close = end_time_close;
        if (children_price !== undefined)
            travelTour.children_price = children_price;
        if (toddler_price !== undefined) travelTour.toddler_price = toddler_price;
        if (status !== undefined) travelTour.status = status;
        if (active !== undefined) travelTour.active = active;
        await travelTour.save();
        res.json({
            message: "Cập nhật tour du lịch thành công!",
            data: travelTour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật tour du lịch với id=" + req.params.id,
            error: error.message,
        });
    }
};

// Đóng Tour tự động khi đủ số lượng người đăng ký
exports.closeTourWhenFull = async (req, res) => {
    try {
        const travelTourId = req.params.id;

        const travelTour = await TravelTour.findByPk(travelTourId);
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour!"});
        }

        if (travelTour.current_people >= travelTour.max_people) {
            travelTour.active = false;
            await travelTour.save();

            res.status(200).json({
                message: "Tour đã được đóng vì đã đủ số lượng người đăng ký!",
                data: travelTour,
            });
        } else {
            res.status(400).json({
                message: "Tour chưa đủ số lượng người đăng ký để đóng.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi đóng tour",
            error: error.message,
        });
    }
};

exports.getListTravelTourForGuide = async (req, res) => {
    try {
        const {user_id} = req.params;
        const {
            page = 1,
            limit = 10,
            start_location_id,
            end_location_id,
            name_tour,
            start_day,
        } = req.query;

        // Tạo điều kiện where cho Tour
        let tourWhereCondition = {};
        if (start_location_id) {
            tourWhereCondition.start_location = start_location_id;
        }
        if (end_location_id) {
            tourWhereCondition.end_location = end_location_id;
        }
        if (name_tour) {
            tourWhereCondition.name_tour = {
                [Op.like]: `%${name_tour}%`,
            };
        }

        const travelGuide = await TravelGuide.findOne({
            where: {
                user_id,
            },
        });
        const travelGuideLocation = await TravelGuideLocation.findAll({
            where: {
                travel_guide_id: travelGuide.id,
            },
        });
        const existingGuideTour = await GuideTour.findAll({
            where: {
                travel_guide_id: travelGuide.id,
            },
        });
        const locationIds = travelGuideLocation.map((loc) => loc.location_id);
        const existingTourIds = existingGuideTour.map((gt) => gt.travel_tour_id);

        // Tạo điều kiện where cho TravelTour
        const travelTourWhereCondition = {
            status: 0,
            active: 1,
            id: {
                [Op.notIn]: existingTourIds,
            },
        };

        // Thêm điều kiện end_location vào tourWhereCondition
        tourWhereCondition.end_location = {
            [Op.in]: locationIds,
        };

        if (start_day) {
            travelTourWhereCondition.start_day = {
                [Op.gte]: new Date(start_day),
            };
        } else {
            travelTourWhereCondition.start_day = {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            };
        }

        const offset = (page - 1) * limit;

        const {count, rows: travelTours} = await TravelTour.findAndCountAll({
            where: travelTourWhereCondition,
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    where: tourWhereCondition,
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["start_day", "ASC"]],
        });

        if (!travelTours || travelTours.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tour du lịch!",
                data: {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: parseInt(page),
                    items: [],
                },
            });
        }

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTours.map((travelTour) => {
            const travelTourData = travelTour.get({plain: true});
            return {
                ...travelTourData,
                tour: {
                    ...travelTourData.Tour,
                    start_location: travelTourData.Tour.StartLocation || null,
                    end_location: travelTourData.Tour.EndLocation || null,
                },
            };
        });

        res.json({
            message: "Lấy danh sách tour thành công!",
            data: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                items: formattedTravelTours,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy tour du lịch",
            error: error.message,
        });
    }
};

exports.getFullTravelTours = async (req, res) => {
    try {
        const travelTours = await TravelTour.findAll({
            where: {
                current_people: {
                    [Op.gte]: Sequelize.col("max_people"), // current_people >= max_people
                },
            },
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTours || travelTours.length === 0) {
            return res.status(404).json({
                message: "Không có travelTour nào đã đủ số lượng người!",
            });
        }

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTours.map((travelTour) => {
            const travelTourData = travelTour.get({plain: true});
            return {
                ...travelTourData,
                tour: {
                    ...travelTourData.Tour,
                    start_location: travelTourData.Tour?.startLocation || null,
                    end_location: travelTourData.Tour?.endLocation || null,
                },
            };
        });

        res.json({
            message: "Lấy danh sách travelTour đã đủ số lượng người thành công!",
            data: formattedTravelTours,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách travelTour đã đủ số lượng người!",
            error: error.message,
        });
    }
};

// Lấy danh sách TravelTour mà Staff phụ trách và trạng thái gán hướng dẫn viên
exports.getTravelToursByStaffWithLocation = async (req, res) => {
    try {
        const {user_id} = req.params;
        const {filter} = req.query;

        // Kiểm tra user_id có phải role Staff không
        const user = await User.findByPk(user_id);
        if (!user || user.role_id !== 2) {
            return res.status(400).json({message: "Người dùng không phải Staff!"});
        }

        // Lấy danh sách Location mà Staff phụ trách
        const staffLocations = await db.StaffLocation.findAll({
            where: {user_id},
            attributes: ["location_id"],
        });

        if (!staffLocations.length) {
            return res
                .status(404)
                .json({message: "Staff không phụ trách địa điểm nào!"});
        }

        const locationIds = staffLocations.map((loc) => loc.location_id);

        // Lấy danh sách TravelGuide có `is_current = true` và liên kết với các Location mà Staff phụ trách
        const travelGuides = await TravelGuide.findAll({
            include: [
                {
                    model: db.TravelGuideLocation,
                    as: "TravelGuideLocations",
                    where: {
                        location_id: {[Sequelize.Op.in]: locationIds},
                        is_current: true, // Chỉ lấy địa điểm hiện tại
                    },
                    attributes: ["location_id"],
                },
            ],
        });

        if (!travelGuides.length) {
            return res.status(404).json({
                message: "Không tìm thấy TravelGuide nào phù hợp!",
            });
        }

        // Lấy danh sách location_id từ TravelGuideLocation
        const travelGuideLocationIds = travelGuides.flatMap((guide) =>
            guide.TravelGuideLocations.map((loc) => loc.location_id)
        );

        // Lấy danh sách TravelTour liên kết với các Location mà TravelGuide phụ trách
        const travelTours = await TravelTour.findAll({
            where: {
                guide_assignment_status: filter ? filter : {[Op.ne]: null}, // Lọc theo trạng thái nếu có
            },
            include: [
                {
                    model: db.Tour,
                    as: "Tour",
                    where: {
                        [Sequelize.Op.and]: [
                            {start_location: {[Sequelize.Op.in]: locationIds}}, // start_location = current_location của TravelGuide
                            {end_location: {[Sequelize.Op.in]: travelGuideLocationIds}}, // end_location = location trong TravelGuideLocation
                        ],
                    },
                    include: [
                        {
                            model: db.Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: db.Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTours.length) {
            return res.status(404).json({
                message: "Không tìm thấy tour nào phù hợp với điều kiện lọc!",
            });
        }

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTours.map((tour) => ({
            id: tour.id,
            name: tour.name,
            start_day: tour.start_day,
            end_day: tour.end_day,
            max_people: tour.max_people,
            assigned_guides: tour.assigned_guides,
            required_guides: tour.required_guides,
            guide_assignment_status: tour.guide_assignment_status,
            start_location: tour.Tour?.startLocation || null,
            end_location: tour.Tour?.endLocation || null,
        }));

        res.status(200).json({
            message: "Lấy danh sách TravelTour thành công!",
            data: formattedTravelTours,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách TravelTour:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách TravelTour!",
            error: error.message,
        });
    }
};

// Lấy danh sách TravelTour mà Staff phụ trách
exports.getTravelToursByStaffEndLocationWithBooking = async (req, res) => {
    try {
        const {user_id} = req.params;

        // Kiểm tra user_id có phải role Staff không
        const user = await User.findByPk(user_id);
        if (!user || user.role_id !== 2) {
            return res.status(400).json({message: "Người dùng không phải Staff!"});
        }

        // Lấy danh sách Location mà Staff phụ trách
        const staffLocations = await db.StaffLocation.findAll({
            where: {user_id},
            attributes: ["location_id"],
        });

        if (!staffLocations.length) {
            return res.status(404).json({
                message: "Staff không phụ trách địa điểm nào!",
            });
        }

        const locationIds = staffLocations.map((loc) => loc.location_id);

        // Lấy danh sách TravelTour có end_location trong bảng Tour trùng với location mà Staff phụ trách
        const travelTours = await TravelTour.findAll({
            // where: {
            //   active: true, // Chỉ lấy các tour chưa đóng
            // },
            include: [
                {
                    model: Booking,
                    as: "Bookings",
                    required: true, // Chỉ lấy các TravelTour có Booking
                },
                {
                    model: Tour,
                    as: "Tour",
                    where: {
                        end_location: {[Sequelize.Op.in]: locationIds},
                    },
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTours.length) {
            return res.status(404).json({
                message: "Không tìm thấy TravelTour nào phù hợp!",
            });
        }

        // Format lại dữ liệu trả về
        const formattedTravelTours = travelTours.map((travelTour) => ({
            id: travelTour.id,
            name: travelTour.Tour?.name_tour || null,
            status: travelTour.status,
            start_day: travelTour.start_day,
            end_day: travelTour.end_day,
            price_tour: travelTour.price_tour,
            max_people: travelTour.max_people,
            current_people: travelTour.current_people,
            start_location: travelTour.Tour?.startLocation || null,
            end_location: travelTour.Tour?.endLocation || null,
            bookings: travelTour.Bookings.map((booking) => ({
                id: booking.id,
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                number_adult: booking.number_adult,
                number_children: booking.number_children,
                number_toddler: booking.number_toddler,
                booking_date: booking.booking_date,
            })),
        }));

        res.status(200).json({
            message: "Lấy danh sách TravelTour thành công!",
            data: formattedTravelTours,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách TravelTour:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách TravelTour!",
            error: error.message,
        });
    }
};
exports.closeTravelTour = async (req, res) => {
    try {
        const {id} = req.params;
        const travelTour = await TravelTour.findByPk(id);
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }
        if (travelTour.active === false) {
            return res.status(400).json({message: "Tour du lịch đã đóng!"});
        }

        travelTour.active = false;
        await travelTour.save();

        res.status(200).json({
            message: "Đóng tour du lịch thành công!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi đóng tour du lịch!",
            error: error.message,
        });
    }
};
exports.completeTravelTour = async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const travelTours = await TravelTour.findAll({
            where: {
                start_day: {
                    [Op.lte]: today,
                },
                end_time_close: {
                    [Op.lt]: now,
                },
                status: 1, // Chỉ lấy những tour đang diễn ra
            },
        });

        if (travelTours.length === 0) {
            return res.status(200).json({
                message: "Không có tour nào cần cập nhật trạng thái!",
            });
        }

        // Cập nhật trạng thái của các tour
        for (const travelTour of travelTours) {
            travelTour.status = 2; // Cập nhật trạng thái thành hoàn thành
            await travelTour.save();
        }

        res.status(200).json({
            message: "Cập nhật trạng thái tour thành công!",
            data: {
                updatedTours: travelTours.length,
                tours: travelTours,
            },
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái tour:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật trạng thái tour!",
            error: error.message,
        });
    }
};

exports.cancelTravelTour = async (req, res) => {
    try {
        const {id} = req.params;
        const travelTour = await TravelTour.findByPk(id);
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }

        if (travelTour.status !== 1 && travelTour.status !== 0) {
            return res.status(400).json({message: "Tour du lịch không đang diễn ra!"});

        }
        const tour = await Tour.findByPk(travelTour.tour_id);
        const bookings = await Booking.findAll({
            where: {
                travel_tour_id: travelTour.id,
            },
        });

        // Lấy thông tin nhân viên đầu tiên có role name là "staff"
        const staff = await User.findOne({
            include: [
                {
                    model: db.Role,
                    as: "role",
                    where: {
                        role_name: "staff",
                    },
                    attributes: ["role_name"],
                },
            ],
            attributes: ["displayName", "email"],
            order: [["id", "ASC"]], // Sắp xếp theo id tăng dần để lấy nhân viên đầu tiên
            limit: 1, // Chỉ lấy 1 user đầu tiên
        });

        if (!staff) {
            return res.status(500).json({
                message: "Không tìm thấy nhân viên để gửi thông báo!",
            });
        }

        if (bookings.length > 0) {
            const notifiedUsers = new Set(); // Tạo Set để theo dõi các user đã được gửi thông báo
            for (const booking of bookings) {
                const user = await User.findByPk(booking.user_id);
                // Chỉ gửi thông báo nếu user chưa được thông báo
                if (!notifiedUsers.has(user.id)) {
                    const messageBody =
                        tour.name_tour +
                        ", ngày khởi hành: " +
                        travelTour.start_day +
                        " đã bị huỷ. Vui lòng liên hệ với nhân viên để được hoàn tiền. Xin chân thành xin lỗi vì sự bất tiện này.";

                    // Gửi email thông báo
                    const emailContent = `
                      <html>
                      <head>
                        <style>
                          body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #fff;
                            margin: 0;
                            padding: 0;
                          }
                          .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            background-color: #fef2f2;
                            position: relative;
                          }
                          h1 {
                            color: #d32f2f;
                            text-align: center;
                          }
                          p {
                            margin: 10px 0;
                          }
                          .info-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                            table-layout: fixed;
                          }
                          .info-table th, .info-table td {
                            border: 1px solid #ddd;
                            padding: 10px;
                            text-align: left;
                            word-wrap: break-word;
                          }
                          .info-table th {
                            background-color: #d32f2f;
                            color: #fff;
                          }
                          .info-table td {
                            background-color: #fff;
                          }
                          .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 0.9em;
                            color: #666;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="email-container">
                          <h1>Thông báo hủy tour du lịch</h1>
                          <p>Xin chào <strong>${user.displayName}</strong>,</p>
                          <p>${messageBody}</p>
                          <p>Thông tin liên hệ nhân viên tư vấn:</p>
                          <ul>
                            <li><strong>Tên:</strong> ${staff.displayName}</li>
                            <li><strong>Email:</strong> ${staff.email}</li>
<!--                            <li><strong>Số điện thoại:</strong> ${staff.phone}</li>-->
                          </ul>
                          <p>Chúng tôi rất tiếc vì sự bất tiện này và mong nhận được sự thông cảm từ bạn.</p>
                          <div class="footer">
                            <p>© 2025 Việt Du Ký</p>
                          </div>
                        </div>
                      </body>
                      </html>
                  `;

                    const mailOptions = {
                        from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                        to: user.email,
                        subject: "Thông báo hủy tour du lịch",
                        html: emailContent,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log("Lỗi khi gửi email: ", error);
                        } else {
                            console.log("Email đã được gửi: " + info.response);
                        }
                    });

                    notifiedUsers.add(user.id); // Thêm user vào danh sách đã thông báo
                }
                booking.status = 3;
                await booking.save();
            }
        }
        const guideTours = await GuideTour.findAll({
            where: {
                travel_tour_id: travelTour.id,
            },
        });
        if (guideTours.length > 0) {
            for (const guideTour of guideTours) {
                guideTour.group = null;
                // guideTour.status = 2;
                await guideTour.save();
            }
        }
        travelTour.status = 3;
        await travelTour.save();
        res.status(200).json({
            message: "Hủy tour du lịch thành công!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi hủy tour du lịch!",
            error: error.message,
        });
    }
};

exports.remindUpcomingTravelTours = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Lấy danh sách travel tour sắp đến ngày và có ít người đăng ký
        const travelTours = await TravelTour.findAll({
            where: {
                start_day: {
                    [Op.between]: [now, thirtyDaysFromNow]
                },
                status: {
                    [Op.in]: [0, 1]
                }
            },
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"]
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"]
                        }
                    ]
                }
            ]
        });

        if (travelTours.length === 0) {
            return res.status(200).json({
                message: "Không có tour nào cần xem xét!"
            });
        }

        // Lấy danh sách staff
        const staffs = await User.findAll({
            include: [
                {
                    model: db.Role,
                    as: "role",
                    where: {
                        role_name: "staff"
                    }
                }
            ]
        });

        if (staffs.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy staff nào!"
            });
        }

        // Gửi thông báo cho từng tour
        for (const travelTour of travelTours) {
            // Kiểm tra nếu số người đăng ký ít hơn 1/5 số người tối đa
            if (travelTour.current_people < travelTour.max_people / 5) {
                const messageBody = `Tour "${travelTour.Tour.name_tour}" sắp đến ngày khởi hành (${travelTour.start_day}) nhưng chỉ có ${travelTour.current_people ? travelTour.current_people : 0}/${travelTour.max_people} người đăng ký. Vui lòng xem xét.`;

                // Gửi thông báo cho tất cả staff
                await sendRoleBasedNotification(
                    ["staff"],
                    {
                        title: "Có tour sắp đến ngày khởi hành!",
                        type: NOTIFICATION_TYPE.TOUR_REMINDER,
                        body: messageBody,
                        id: travelTour.id
                    }
                );
            }
        }

        res.status(200).json({
            message: "Đã gửi thông báo thành công!",
            data: {
                totalTours: travelTours.length,
                notifiedStaffs: staffs.length
            }
        });

    } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
        res.status(500).json({
            message: "Lỗi khi gửi thông báo!",
            error: error.message
        });
    }
};
