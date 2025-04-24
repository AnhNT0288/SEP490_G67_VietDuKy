const db = require("../models");
const {Op, Sequelize} = require("sequelize");
const Tour = db.Tour;
const Location = db.Location;
const TypeTour = db.TypeTour;
const TravelTour = db.TravelTour;
const TourActivities = db.TourActivities;
const Service = db.Service;
const TourService = db.TourService;
const Topic = db.Topic;
const Feedback = db.Feedback;
const User = db.User;
const TourInfo = db.TourInfo;

// Lấy danh sách tất cả Tour
// exports.getAllTours = async (req, res) => {
//   try {
//     const tours = await Tour.findAll();
//     res.json(tours);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//Lấy danh sách tất cả Tour
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.findAll({
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {model: TypeTour, as: "typeTour"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
            ],
        });

        // Định dạng lại dữ liệu để dễ sử dụng hơn
        const formattedTours = tours.map((tour) => {
            const tourData = tour.get({plain: true});
            return {
                ...tourData,
                services: tourData.Services || [],
            };
        });

        res.json({
            message: "Lấy danh sách tour thành công!",
            data: formattedTours,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour!",
            error: error.message,
        });
    }
};

//Lấy thông tin Tour theo ID
// Lấy thông tin Tour theo ID
exports.getTourById = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await Tour.findOne({
            where: {id: tourId},
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
                {
                    model: TourActivities,
                    attributes: ["id", "day", "title", "description", "detail", "image"],
                    order: [["day", "ASC"]],
                },
                {
                    model: Feedback,
                    attributes: ["rating", "description_feedback", "feedback_date"],
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                    ],
                },
            ],
        });

        if (!tour) {
            return res.status(404).json({
                message: "Không tìm thấy tour!",
            });
        }
        const tourInfo = await TourInfo.findAll({ where: { tour_id: tour.id } });   
        const {rows: tours} = await Tour.findAndCountAll({
            where: {
                [Op.or]: [
                    {end_location: tour.end_location},
                    {start_location: tour.start_location},
                ],
            },
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
                {model: TypeTour, as: "typeTour"},
            ],
            limit: 10,
        });
        // Format lại dữ liệu trả về
        const tourData = tour.get({plain: true});
        const formattedTour = {
            ...tourData,
            related_tours: tours || [],
            services: tourData.Services || [],
            activities: tourData.TourActivities || [],
            feedbacks: tourData.Feedbacks || [],
            discount_services: tourData.DiscountServices || [],
            tourInfo: tourInfo || [],
        };
        delete formattedTour.Services;
        delete formattedTour.TourActivities;

        res.json({
            message: "Lấy thông tin tour thành công!",
            data: formattedTour,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy thông tin tour!",
            error: error.message,
        });
    }
};

exports.searchTour = async (req, res) => {
    try {
        const {
            start,
            end,
            date,
            page = 1,
            limit = 10,
            priceRange, // Dưới 5 triệu, 5-10 triệu, 10-20 triệu, Trên 20 triệu
            typeId, // ID của loại tour (cao cấp, tiêu chuẩn, tiết kiệm, giá tốt)
            topicId, // ID của chủ đề tour
        } = req.query;

        let whereCondition = {};

        // Xử lý filter theo khoảng giá
        if (priceRange) {
            switch (priceRange) {
                case "under5m":
                    whereCondition.price_tour = {[Op.lt]: 5000000};
                    break;
                case "5mTo10m":
                    whereCondition.price_tour = {[Op.between]: [5000000, 10000000]};
                    break;
                case "10mTo20m":
                    whereCondition.price_tour = {[Op.between]: [10000000, 20000000]};
                    break;
                case "over20m":
                    whereCondition.price_tour = {[Op.gt]: 20000000};
                    break;
            }
        }

        // Filter theo loại tour
        if (typeId) {
            whereCondition.type_id = typeId;
        }

        // Filter theo chủ đề
        if (topicId) {
            whereCondition.topic_id = topicId;
        }

        // Tìm location_id từ tên địa điểm nếu có
        if (start) {
            const startLocation = await Location.findOne({
                where: db.sequelize.literal(
                    `LOWER(name_location) LIKE LOWER('%${start}%')`
                ),
            });
            if (startLocation) {
                whereCondition.start_location = startLocation.id;
            }
        }

        if (end) {
            const endLocation = await Location.findOne({
                where: db.sequelize.literal(
                    `LOWER(name_location) LIKE LOWER('%${end}%')`
                ),
            });
            if (endLocation) {
                whereCondition.end_location = endLocation.id;
            }
        }

        // Tìm các tour_id từ travel_tour theo ngày nếu có
        if (date) {
            console.log("Searching for date:", date);

            const searchDate = new Date(date).toISOString().split("T")[0];

            const travelTours = await TravelTour.findAll({
                where: {
                    start_day: {
                        [Op.eq]: searchDate,
                    },
                },
                attributes: ["tour_id", "start_day"],
                raw: true,
            });

            console.log("Found travel tours:", travelTours);

            if (travelTours.length > 0) {
                const tourIds = travelTours.map((tour) => tour.tour_id);
                console.log("Tour IDs found:", tourIds);

                whereCondition.id = {
                    [Op.in]: tourIds,
                };
            } else {
                console.log("No tours found for date:", date);
                whereCondition.id = {
                    [Op.in]: [-1], // Một giá trị không tồn tại
                };
            }
        }

        // Tính toán phân trang
        const offset = (page - 1) * limit;

        // Query tours với điều kiện tìm kiếm
        const {count, rows: tours} = await Tour.findAndCountAll({
            where: whereCondition,
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {model: TypeTour, as: "typeTour"},
                {model: Topic, as: "topic"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["id", "DESC"]],
        });

        // if (!tours || tours.length === 0) {
        //     return res.status(404).json({
        //         message: "Không tìm thấy tour nào phù hợp!",
        //     });
        // }

        // Format lại dữ liệu trả về
        const formattedTours = tours.map((tour) => {
            const tourData = tour.get({plain: true});
            return {
                ...tourData,
                services: tourData.Services || [],
            };
        });

        res.json({
            message: "Tìm kiếm tour thành công!",
            data: {
                totalTours: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                tours: formattedTours,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi tìm kiếm tour!",
            error: error.message,
        });
    }
};
exports.getTourActivities = async (req, res) => {
    try {
        const tourId = req.params.id;

        // Kiểm tra tour có tồn tại không
        const tour = await Tour.findByPk(tourId);
        if (!tour) {
            return res.status(404).json({
                message: "Tour không tồn tại!",
            });
        }

        // Lấy danh sách hoạt động
        const activities = await TourActivities.findAll({
            where: {
                tour_id: tourId,
            },
            order: [["day", "ASC"]], // Sắp xếp theo ngày tăng dần
            attributes: ["id", "day", "title", "description", "detail", "image"],
        });

        res.json({
            message: "Lấy danh sách hoạt động thành công!",
            data: {
                tour_id: tourId,
                tour_name: tour.name_tour,
                activities: activities,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hoạt động:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hoạt động!",
            error: error.message,
        });
    }
};
// Tạo`code_tour` = `[Loại Tour] + [Điểm khởi hành] + [STT]`
const generateTourCode = async (type_id, start_location) => {
    try {
        // Kiểm tra xem type_id có tồn tại không
        const typeTour = await TypeTour.findByPk(type_id);
        if (!typeTour) {
            console.error("Lỗi: Không tìm thấy loại tour");
            res.status(500).json({
                message: "Lỗi khi tạo mã tour",
                error: error.message,
            });
            return null;
        }

        // Tạo mã loại tour viết tắt
        const tourTypeCode = typeTour.name_type
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

        // Lấy mã điểm khởi hành (viết tắt 2 ký tự đầu)
        const locationCode = start_location
            .toString()
            .substring(0, 2)
            .toUpperCase();

        //Kiểm tra mã có bị trùng không trước khi tạo
        let sequenceNumber;
        let newCode;
        let duplicate = true;
        let attempt = 1;

        while (duplicate && attempt <= 5) {
            // Giới hạn số lần thử
            // Đếm số lượng tour hiện có cùng loại
            const tourCount = await Tour.count({where: {type_id}});

            // Số thứ tự (định dạng 001, 002, ...)
            sequenceNumber = String(tourCount + 1).padStart(3, "0");

            // Tạo `code_tour`
            newCode = `${tourTypeCode}-${locationCode}-${sequenceNumber}`;

            // Kiểm tra xem mã này đã tồn tại chưa
            const existingTour = await Tour.findOne({
                where: {code_tour: newCode},
            });
            if (!existingTour) {
                duplicate = false;
            } else {
                attempt++;
            }
        }

        if (duplicate) {
            res.status(500).json({
                message: "Lỗi khi tạo mã tour - mã đã tồn tại!",
                error: "Trùng mã tour",
            });
            return null;
        }

        return newCode;
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tạo mã tour",
            error: error.message,
        });
        return null;
    }
};

//Tạo một Tour mới
exports.createTour = async (req, res) => {
    try {
        const {
            type_id,
            service_id,
            name_tour,
            price_tour,
            day_number,
            rating_tour,
            activity_description,
            start_location,
            end_location,
            available_month,
            service_ids,
            passport,
        } = req.body;
        const travel_tours = req.body.travel_tours
            ? JSON.parse(req.body.travel_tours)
            : [];

        // Chuyển đổi service_ids từ string sang array
        let parsedServiceIds = [];
        if (service_ids) {
            try {
                parsedServiceIds = JSON.parse(service_ids);
                if (!Array.isArray(parsedServiceIds)) {
                    parsedServiceIds = [parsedServiceIds];
                }
            } catch (error) {
                console.error("Lỗi khi phân tích cú pháp service_ids:", error);
                parsedServiceIds = [service_ids];
            }
        }

        const album =
            req.files && req.files.length > 0
                ? JSON.stringify(req.files.map((file) => file.path))
                : null;

        const startLoc = await Location.findByPk(Number(start_location));
        const endLoc = await Location.findByPk(Number(end_location));

        if (!startLoc || !endLoc) {
            return res
                .status(400)
                .json({message: "Điểm khởi hành hoặc điểm đến không tồn tại!"});
        }

        if (
            !type_id ||
            !service_id ||
            !name_tour ||
            !price_tour ||
            !day_number ||
            !rating_tour ||
            !activity_description ||
            !start_location ||
            !end_location ||
            !available_month ||
            !album
        ) {
            console.error("Missing fields:", req.body);
            return res.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin tour!",
            });
        }
        // Tạo `code_tour`
        const code_tour = await generateTourCode(type_id, startLoc.id);
        if (!code_tour) {
            return res.status(500).json({message: "Lỗi khi tạo code tour"});
        }

        // Kiểm tra `code_tour` đã tồn tại chưa trước khi lưu vào DB
        const existingTour = await Tour.findOne({where: {code_tour}});
        if (existingTour) {
            return res.status(400).json({message: "Mã tour đã tồn tại!"});
        }

        if (!code_tour || code_tour.trim() === "") {
            return res
                .status(400)
                .json({message: "Mã tour không hợp lệ được tạo!"});
        }

        const tourData = {
            type_id: Number(type_id),
            service_id: Number(service_id),
            name_tour,
            price_tour: Number(price_tour),
            day_number: Number(day_number),
            rating_tour: Number(rating_tour),
            activity_description,
            album,
            start_location: Number(start_location),
            end_location: Number(end_location),
            available_month,
            code_tour,
            passport: passport ? 1 : 0,
        };

        const newTour = await Tour.create(tourData);
        if (parsedServiceIds && parsedServiceIds.length > 0) {
            const services = await Service.findAll({
                where: {
                    id: parsedServiceIds,
                },
            });

            if (services.length !== parsedServiceIds.length) {
                return res.status(404).json({
                    message: "Một số dịch vụ không tồn tại!",
                });
            }
            const tourServiceData = parsedServiceIds.map((service_id) => ({
                tour_id: newTour.id,
                service_id,
            }));
            await TourService.bulkCreate(tourServiceData);
        }

        if (travel_tours && travel_tours.length > 0) {
            const travelTourData = travel_tours.map((tour) => ({
                ...tour,
                tour_id: newTour.id,
            }));

            await TravelTour.bulkCreate(travelTourData);
            res.json({
                message: "Tạo tour và TravelTour thành công!",
                tour: newTour,
                travel_tours: travelTourData,
            });
        } else {
            res.json({
                message: "Tạo tour thành công!",
                tour: newTour,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi tạo tour",
            error: error.message,
        });
    }
};

//Xóa một Tour theo ID
exports.deleteTourById = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await db.Tour.findByPk(tourId);

        if (!tour) {
            return res.status(404).json({message: "Tour không tồn tại"});
        }

        await tour.destroy();
        res.json({
            message: "Xóa tour thành công!",
            data: tour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa tour",
            error: error,
        });
    }
};

//Cập nhật thông tin Tour
exports.updateTourById = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await db.Tour.findByPk(tourId);

        if (!tour) {
            return res.status(404).json({message: "Tour không tồn tại!"});
        }
    if (req.body.removed_urls) {
      try {
        const removedUrls = JSON.parse(req.body.removed_urls);
        if (Array.isArray(removedUrls)) {
          const currentAlbum = JSON.parse(tour.album || "[]");

          // Lọc ra ảnh còn lại
          const updatedAlbum = currentAlbum.filter(
              (url) => !removedUrls.includes(url)
          );

          tour.album = JSON.stringify(updatedAlbum);
        }
      } catch (err) {
        console.error("Lỗi parse removed_urls:", err);
      }
    }

    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại!" });
    }

        const album =
            req.files && req.files.length > 0
                ? JSON.stringify(req.files.map((file) => file.path))
                : null;

    if (req.body.type_id !== undefined) tour.type_id = req.body.type_id;
    if (req.body.service_id !== undefined)
      tour.service_id = req.body.service_id;
    if (req.body.name_tour !== undefined) tour.name_tour = req.body.name_tour;
    if (req.body.price_tour !== undefined)
      tour.price_tour = req.body.price_tour;
    if (req.body.day_number !== undefined)
      tour.day_number = req.body.day_number;
    if (req.body.rating_tour !== undefined)
      tour.rating_tour = req.body.rating_tour;
    if (req.body.activity_description !== undefined)
      tour.activity_description = req.body.activity_description;
    if (req.body.start_location !== undefined)
      tour.start_location = req.body.start_location;
    if (req.body.end_location !== undefined)
      tour.end_location = req.body.end_location;
    if (req.body.available_month !== undefined)
      tour.available_month = req.body.available_month;
    if (req.files && req.files.length > 0) {
      tour.album = album;
    }
    if (req.body.service_ids !== undefined && req.body.service_ids.length > 0) {
      const serviceIds = req.body.service_ids; // Lấy danh sách service_id từ request

            // Tìm tất cả services có trong database dựa trên danh sách serviceIds
            const services = await Service.findAll({
                where: {
                    id: serviceIds,
                },
            });

            if (services.length !== serviceIds.length) {
                return res.status(404).json({
                    message: "Một số dịch vụ không tồn tại!",
                });
            }

            // Tìm danh sách dịch vụ hiện tại trong TourService
            const existingTourServices = await TourService.findAll({
                where: {
                    tour_id: tourId,
                },
            });

            // Lấy danh sách service_id hiện có
            const existingServiceIds = existingTourServices.map(
                (service) => service.service_id
            );

            // Tìm các dịch vụ cần thêm
            if (serviceIds.length > 0) {
                const servicesToAdd = serviceIds.filter(
                    (id) => !existingServiceIds.includes(id)
                );
            }

            // Tìm các dịch vụ cần xóa
            const servicesToRemove = existingServiceIds.filter(
                (id) => !serviceIds.includes(id)
            );

            // Xóa các dịch vụ không còn trong danh sách mới
            if (servicesToRemove.length > 0) {
                await TourService.destroy({
                    where: {
                        tour_id: tourId,
                        service_id: {
                            [Op.in]: servicesToRemove,
                        },
                    },
                });
            }

            // Thêm các dịch vụ mới vào TourService
            if (servicesToAdd.length > 0) {
                const tourServiceData = servicesToAdd.map((service_id) => ({
                    tour_id: tourId,
                    service_id,
                }));

                await TourService.bulkCreate(tourServiceData);
            }
        }

        await tour.save();
        res.json({
            message: "Cập nhật tour thành công!",
            data: tour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật tour",
            error: error,
        });
        console.log("Error:", error);
        
    }
};

exports.getTourByLocationId = async (req, res) => {
    try {
        const locationId = req.params.locationId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const {count, rows: tours} = await Tour.findAndCountAll({
            where: {end_location: locationId},
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
            ],
            limit,
            offset,
        });

        if (!tours || tours.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tour nào cho địa điểm này!",
            });
        }

        // Định dạng lại dữ liệu để dễ sử dụng hơn
        const formattedTours = tours.map((tour) => {
            const tourData = tour.get({plain: true});
            return {
                ...tourData,
                services: tourData.Services || [],
            };
        });

        res.json({
            message: "Lấy danh sách tour thành công!",
            data: {
                totalTours: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                tours: formattedTours,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour theo địa điểm!",
            error: error.message,
        });
    }
};

// Lấy danh sách tour theo chủ đề
exports.getToursByTopicId = async (req, res) => {
    try {
        const topicId = req.params.topicId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const {count, rows: tours} = await Tour.findAndCountAll({
            where: {topic_id: topicId},
            include: [
                {model: Location, as: "startLocation"},
                {model: Location, as: "endLocation"},
                {
                    model: Service,
                    as: "Services",
                    through: {attributes: []},
                    attributes: [
                        "id",
                        "name_service",
                        "description_service",
                        "price_service",
                    ],
                },
                {model: TypeTour, as: "typeTour"},
            ],
            limit,
            offset,
        });

        // if (!tours || tours.length === 0) {
        //     return res.status(404).json({
        //         message: "Không tìm thấy tour nào cho chủ đề này!",
        //     });
        // }

        // Định dạng lại dữ liệu để dễ sử dụng hơn
        const formattedTours = tours.map((tour) => {
            const tourData = tour.get({plain: true});
            return {
                ...tourData,
                services: tourData.Services || [],
            };
        });

        res.json({
            message: "Lấy danh sách tour thành công!",
            data: {
                totalTours: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                tours: formattedTours,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour theo chủ đề!",
            error: error.message,
        });
    }
};
