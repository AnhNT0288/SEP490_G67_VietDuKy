const db = require("../models");
const Tour = db.Tour;
const Service = db.Service;
const TourService = db.TourService;

// Tạo tour service mới
exports.createTourService = async (req, res) => {
    try {
        const {tour_id, service_ids} = req.body;

        // Kiểm tra tour có tồn tại không
        const tour = await Tour.findByPk(tour_id);
        if (!tour) {
            return res.status(404).json({
                message: "Tour không tồn tại!"
            });
        }

        // Kiểm tra các service có tồn tại không
        const services = await Service.findAll({
            where: {
                id: service_ids
            }
        });

        if (services.length !== service_ids.length) {
            return res.status(404).json({
                message: "Một số dịch vụ không tồn tại!"
            });
        }

        const existingTourServices = await TourService.findAll({
            where: {
                tour_id,
                service_id: service_ids
            }
        });

        if (existingTourServices.length > 0) {
            const existingServiceIds = existingTourServices.map(ts => ts.service_id);
            const duplicateServices = services.filter(service =>
                existingServiceIds.includes(service.id)
            );

            return res.status(400).json({
                message: "Một số dịch vụ đã được thêm cho tour này!",
                duplicateServices: duplicateServices.map(service => ({
                    id: service.id,
                    name: service.name_service
                }))
            });
        }

        // Tạo các bản ghi trong bảng tour_service
        const tourServiceData = service_ids.map(service_id => ({
            tour_id,
            service_id
        }));

        const createdTourServices = await TourService.bulkCreate(tourServiceData);

        res.status(201).json({
            message: "Thêm dịch vụ cho tour thành công!",
            data: {
                tour_id,
                services: services.map(service => ({
                    id: service.id,
                    name: service.name_service,
                    description: service.description_service,
                    price: service.price_service
                }))
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi thêm dịch vụ cho tour!",
            error: error.message
        });
    }
}; 