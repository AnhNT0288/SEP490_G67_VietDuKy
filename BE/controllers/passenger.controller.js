const db = require("../models");
const Passenger = db.Passenger;
const Booking = db.Booking;
const TravelGuide = db.TravelGuide;

// Tạo hành khách mới
exports.createPassenger = async (req, res) => {
    try {
        const {
            name,
            birth_date,
            gender,
            phone_number,
            passport_number,
            booking_id,
            single_room,
        } = req.body;

        if (
            !name ||
            !birth_date ||
            !gender ||
            // !phone_number ||
            // !passport_number ||
            !booking_id
        ) {
            return res
                .status(400)
                .json({message: "Thiếu thông tin bắt buộc để tạo hành khách"});
        }

        const existingBooking = await db.Booking.findByPk(booking_id);
        if (!existingBooking) {
            return res
                .status(404)
                .json({message: "Không tìm thấy đặt chỗ tương ứng với booking_id"});
        }

        const passenger = await Passenger.create({
            name,
            birth_date,
            gender,
            phone_number,
            passport_number,
            booking_id,
            single_room,
        });

        res.status(201).json({
            message: "Tạo hành khách mới thành công",
            data: passenger,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tạo hành khách mới",
            error: error.message,
        });
    }
};

// Lấy hành khách theo booking_id
exports.getPassengerByBookingId = async (req, res) => {
    try {
        const {booking_id} = req.params;

        if (!booking_id) {
            return res
                .status(400)
                .json({message: "Thiếu booking_id trong yêu cầu"});
        }

        const existingBooking = await Booking.findByPk(booking_id);
        if (!existingBooking) {
            return res
                .status(404)
                .json({message: "Không tìm thấy đặt chỗ tương ứng với booking_id"});
        }

        const passengers = await Passenger.findAll({where: {booking_id}});
        if (!passengers || passengers.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy hành khách nào liên quan đến booking_id",
            });
        }

        res.status(200).json({
            message: "Lấy danh sách hành khách theo booking_id thành công",
            data: passengers,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hành khách theo booking_id",
            error: error.message,
        });
    }
};

// Xóa hành khách
exports.deletePassenger = async (req, res) => {
    try {
        const {id} = req.params;

        const passenger = await Passenger.findByPk(id);
        if (!passenger) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hành khách với id được cung cấp"});
        }

        await passenger.destroy();
        res.status(200).json({message: "Hành khách đã được xóa thành công"});
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa hành khách",
            error: error.message,
        });
    }
};

// Cập nhật thông tin hành khách
exports.updatePassenger = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, birth_date, gender, phone_number, passport_number} =
            req.body;

        const passenger = await Passenger.findByPk(id);
        if (!passenger) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hành khách với id được cung cấp"});
        }

        if (name != undefined) passenger.name = name;
        if (birth_date != undefined) passenger.birth_date = birth_date;
        if (gender != undefined) passenger.gender = gender;
        if (phone_number != undefined) passenger.phone_number = phone_number;
        if (passport_number != undefined)
            passenger.passport_number = passport_number;

        await passenger.save();

        res.status(200).json({
            message: "Cập nhật thông tin hành khách thành công",
            data: passenger,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật thông tin hành khách",
            error: error.message,
        });
    }
};

exports.getPassengersByTravelGuideId = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;

        if (!travel_guide_id) {
            return res.status(400).json({message: "Thiếu travel_guide_id"});
        }

        const passengers = await Passenger.findAll({
            where: {travel_guide_id},
        });

        if (!passengers || passengers.length === 0) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hành khách nào!"});
        }

        res.status(200).json({
            message: "Lấy danh sách hành khách thành công!",
            data: passengers,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hành khách!",
            error: error.message,
        });
    }
};

exports.getPassengersByTravelTourId = async (req, res) => {
    try {
        const {travel_tour_id} = req.params;
        const {assigned} = req.query;

        if (!travel_tour_id) {
            return res.status(400).json({message: "Thiếu travel_tour_id"});
        }

        // Tìm tất cả các booking liên quan đến travel_tour_id
        const bookings = await Booking.findAll({
            where: {travel_tour_id, status: 2},
            attributes: ["id", "number_adult", "number_children", "travel_tour_id"], // Lấy thông tin cần thiết
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({message: "Không tìm thấy booking nào!"});
        }

        // Lấy danh sách booking_id
        const bookingIds = bookings.map((booking) => booking.id);

        // Tìm tất cả hành khách liên quan đến các booking_id
        if (assigned == false) {
        const passengers = await Passenger.findAll({
            where: {
                booking_id: bookingIds,
                group: null
            },
            include: [
                {
                    model: Booking,
                    as: "booking",
                    attributes: [
                        "id",
                        "number_adult",
                        "number_children",
                        "travel_tour_id",
                        "booking_code",
                    ],
                },
            ],
        });
        } else {
            const passengers = await Passenger.findAll({
                where: {booking_id: bookingIds},
                include: [
                    {
                        model: Booking,
                        as: "booking",
                        attributes: [
                            "id",
                            "number_adult",
                            "number_children",
                            "travel_tour_id",
                            "booking_code",
                        ],
                    },
                ],
            });
        }

        if (!passengers || passengers.length === 0) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hành khách nào!"});
        }

        // Nhóm hành khách theo booking_id và tính tổng số người lớn, trẻ em
        const groupedPassengers = passengers.reduce((acc, passenger) => {
            const booking = passenger.booking;
            if (!booking) {
                return acc; // Bỏ qua nếu không có thông tin booking
            }

            const bookingId = booking.id;

            if (!acc[bookingId]) {
                acc[bookingId] = {
                    booking_id: bookingId,
                    booking_code: booking.booking_code,
                    number_adult: booking.number_adult,
                    number_children: booking.number_children,
                    travel_tour_id: booking.travel_tour_id,
                    passengers: [],
                };
            }

            acc[bookingId].passengers.push(passenger);
            return acc;
        }, {});

        res.status(200).json({
            message: "Lấy danh sách hành khách thành công!",
            data: Object.values(groupedPassengers),
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hành khách!",
            error: error.message,
        });
    }
};

exports.assignPassengersToTravelGuide = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const {travel_tour_id} = req.body;
        const {passenger_ids} = req.body;

        if (
            !passenger_ids ||
            !Array.isArray(passenger_ids) ||
            passenger_ids.length === 0
        ) {
            return res
                .status(400)
                .json({message: "Danh sách passenger_ids không hợp lệ!"});
        }

        // Kiểm tra TravelGuide có tồn tại không
        const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
        if (!travelGuide) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }
        const guideTour = await db.GuideTour.findOne({
            where: {travel_guide_id: travel_guide_id, travel_tour_id: travel_tour_id}
        })
        if (!guideTour) {
            return res.status(404).json({message: "Không tìm thấy hướng dẫn viên!"});
        }
        // Kiểm tra và lấy danh sách Passenger
        const passengers = await Passenger.findAll({
            where: {id: passenger_ids},
        });

        if (!passengers || passengers.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy hành khách nào trong danh sách passenger_ids!",
            });
        }

        // Kiểm tra nếu bất kỳ hành khách nào đã được assign cho một TravelGuide khác
        const alreadyAssignedPassengers = passengers.filter(
            (passenger) =>
                passenger.travel_guide_id &&
                passenger.travel_guide_id !== travel_guide_id
        );

        if (alreadyAssignedPassengers.length > 0) {
            return res.status(400).json({
                message: "Một số hành khách đã được phân công cho hướng dẫn viên khác!",
                data: alreadyAssignedPassengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    assigned_travel_guide_id: p.travel_guide_id,
                })),
            });
        }
        const anotherGuideTour = await db.GuideTour.findAll({
            where: {travel_tour_id: travel_tour_id}
        })
        // Tìm group lớn nhất hiện có của travel_guide_id và tăng lên 1
        if (!guideTour.group) {
            // Tìm group lớn nhất trong danh sách anotherGuideTour
            const maxGroup = anotherGuideTour.reduce((max, current) => {
                return current.group > max ? current.group : max;
            }, 0);
            console.log(maxGroup);
            
            // Gán group mới bằng maxGroup + 1
            guideTour.group = maxGroup + 1;
            guideTour.save();
        }

        // Gộp tất cả hành khách vào một nhóm và gán travel_guide_id
        await Promise.all(
            passengers.map((passenger) => {
                passenger.travel_guide_id = travel_guide_id;
                passenger.group = guideTour.group;
                return passenger.save();
            })
        );
        

        res.status(200).json({
            message: "Phân công hành khách cho hướng dẫn viên thành công!",
            data: passengers,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi phân công hành khách!",
            error: error.message,
        });
    }
};

// Lấy danh sách hành khách theo travel_guide_id
exports.getPassengersByTravelGuideIdBooking = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const {travel_tour_id} = req.query;

        if (!travel_guide_id) {
            return res.status(400).json({message: "Thiếu travel_guide_id"});
        }
        const guideTour = await db.GuideTour.findOne({
            where: {travel_guide_id, travel_tour_id}
        })
        if(!guideTour) {
            return res.status(404).json({message: "Không tìm thấy hướng dẫn viên!"});
        }
        const bookings = await Booking.findAll({
            where: {travel_tour_id}
        })
        const bookingIds = bookings.map((booking) => booking.id);

        // Lấy danh sách hành khách theo travel_guide_id
        const passengers = await Passenger.findAll({
            where: {booking_id: bookingIds, group: guideTour.group},
            include: [
                {
                    model: Booking,
                    as: "booking",
                    attributes: [
                        "id",
                        "number_adult",
                        "number_children",
                        "travel_tour_id",
                        "booking_code"
                    ],
                },
            ],
        });

        // Nhóm hành khách theo booking_id và tính tổng số người lớn, trẻ em
        const groupedPassengers = passengers.reduce((acc, passenger) => {
            const booking = passenger.booking;
            if (!booking) {
                return acc; // Bỏ qua nếu không có thông tin booking
            }

            const bookingId = booking.id;

            if (!acc[bookingId]) {
                acc[bookingId] = {
                    booking_id: bookingId,
                    booking_code: booking.booking_code,
                    number_adult: booking.number_adult,
                    number_children: booking.number_children,
                    travel_tour_id: booking.travel_tour_id,
                    passengers: [],
                };
            }

            acc[bookingId].passengers.push(passenger);
            return acc;
        }, {});

        res.status(200).json({
            message: "Lấy danh sách hành khách thành công!",
            data: Object.values(groupedPassengers),
            guideTour: guideTour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hành khách!",
            error: error.message,
        });
    }
};

// Gán thêm hành khách vào hướng dẫn viên
exports.addPassengersToTravelGuide = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const {passenger_ids} = req.body;

        if (
            !passenger_ids ||
            !Array.isArray(passenger_ids) ||
            passenger_ids.length === 0
        ) {
            return res
                .status(400)
                .json({message: "Danh sách passenger_ids không hợp lệ!"});
        }

        // Kiểm tra TravelGuide có tồn tại không
        const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
        if (!travelGuide) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        // Kiểm tra và lấy danh sách Passenger
        const passengers = await Passenger.findAll({
            where: {id: passenger_ids},
        });

        if (!passengers || passengers.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy hành khách nào trong danh sách passenger_ids!",
            });
        }

        // Kiểm tra nếu bất kỳ hành khách nào đã được assign cho một TravelGuide khác
        const alreadyAssignedPassengers = passengers.filter(
            (passenger) =>
                passenger.travel_guide_id &&
                passenger.travel_guide_id !== travel_guide_id
        );

        if (alreadyAssignedPassengers.length > 0) {
            return res.status(400).json({
                message: "Một số hành khách đã được phân công cho hướng dẫn viên khác!",
                data: alreadyAssignedPassengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    assigned_travel_guide_id: p.travel_guide_id,
                })),
            });
        }

        // Tìm group hiện tại của travel_guide_id
        const currentGroup = await Passenger.findOne({
            where: {travel_guide_id},
            attributes: ["group"],
            order: [["group", "DESC"]],
        });

        const groupToAssign = currentGroup ? currentGroup.group : 1; // Nếu không có group, mặc định là 1

        // Gộp tất cả hành khách vào nhóm hiện tại và gán travel_guide_id
        await Promise.all(
            passengers.map((passenger) => {
                passenger.travel_guide_id = travel_guide_id;
                passenger.group = groupToAssign;
                return passenger.save();
            })
        );

        res.status(200).json({
            message: "Thêm hành khách mới cho hướng dẫn viên thành công!",
            data: passengers,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi thêm hành khách mới!",
            error: error.message,
        });
    }
};

// Xóa hành khách khỏi hướng dẫn viên
exports.removePassengersFromTravelGuide = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const {passenger_ids} = req.body;

        if (
            !passenger_ids ||
            !Array.isArray(passenger_ids) ||
            passenger_ids.length === 0
        ) {
            return res
                .status(400)
                .json({message: "Danh sách passenger_ids không hợp lệ!"});
        }

        // Kiểm tra TravelGuide có tồn tại không
        const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
        if (!travelGuide) {
            return res
                .status(404)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        // Xóa các hành khách khỏi TravelGuide
        const updatedCount = await Passenger.update(
            {travel_guide_id: null, group: null},
            {
                where: {
                    id: passenger_ids,
                    travel_guide_id,
                },
            }
        );

        if (updatedCount[0] === 0) {
            return res.status(404).json({
                message:
                    "Không tìm thấy hành khách nào để xóa hoặc hành khách không thuộc hướng dẫn viên này!",
            });
        }

        res.status(200).json({
            message: "Xóa hành khách khỏi hướng dẫn viên thành công!",
            updatedCount: updatedCount[0],
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa hành khách!",
            error: error.message,
        });
    }
};

exports.getPassengerByTravelGuideId2 = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const travel_tour_id = req.query.travel_tour_id;
        const guideTour = await db.GuideTour.findOne({
            where: {travel_guide_id, travel_tour_id}
        })
        if(!guideTour) {
            return res.status(404).json({message: "Không tìm thấy hướng dẫn viên!"});
        }
        console.log(guideTour.group);
        if(!guideTour.group) {
            return res.status(404).json({message: "Hướng dẫn viên chưa được chia nhóm!"});
        }
        const travelGuide = await TravelGuide.findOne({
            where: {id: travel_guide_id}
        })
        if(!travelGuide) {
            return res.status(404).json({message: "Không tìm thấy hướng dẫn viên!"});
        }
        const bookings = await Booking.findAll({
            where: {travel_tour_id}
        })
        const bookingIds = bookings.map((booking) => booking.id);
        const passengers = await Passenger.findAll({
            where: {booking_id: bookingIds, group: guideTour.group},
            include: [
                {
                    model: Booking,
                    as: "booking",
                },
            ],
        });
        res.status(200).json({
            message: "Lấy danh sách hành khách thành công!",
            data: passengers,
            travelGuide: travelGuide,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy hành khách!",
            error: error.message,
        });
    }
}

exports.removePassengerGroup = async (req, res) => {
    try {
        const {passenger_id} = req.params;
        const passengers = await Passenger.findByPk(passenger_id)
        if(!passengers) {
            return res.status(404).json({message: "Không tìm thấy hành khách!"});
        }
        passengers.group = null;
        passengers.travel_guide_id = null;
        await passengers.save();
        res.status(200).json({message: "Xóa nhóm hành khách thành công!", data: passengers});
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa nhóm hành khách!",
            error: error.message,
        });
    }
}

