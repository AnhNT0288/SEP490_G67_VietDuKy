const db = require("../models");
const GuideTour = db.GuideTour;
const TravelGuide = db.TravelGuide;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;
const User = db.User;
const Booking = db.Booking;
const Passenger = db.Passenger;
const { Op } = require("sequelize");

// Lấy tất cả các tour mà một hướng dẫn viên tham gia bằng id
exports.getGuideTours = async (req, res) => {
  try {
    const travel_guide_id = req.params.id;

    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    const guideTours = await GuideTour.findAll({
      where: { travel_guide_id: travel_guide_id },
      include: [
        {
          model: TravelTour,
          as: "travelTour",
        },
        {
          model: TravelGuide,
          as: "travelGuide",
        },
      ],
    });

    if (guideTours.length === 0) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy tour nào cho hướng dẫn viên này!" });
    }

    res.status(200).json({
      message: "Lấy danh sách tour của hướng dẫn viên thành công!",
      data: guideTours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
      error: error.message,
    });
  }
};

// Thêm hướng dẫn viên vào một tour
exports.addGuideToTour = async (req, res) => {
  try {
    const { travel_tour_id, travel_guide_id } = req.body;

    // Kiểm tra tour du lịch tồn tại
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }

    // Kiểm tra hướng dẫn viên tồn tại
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Kiểm tra hướng dẫn viên đã được gán cho tour này chưa
    const existingGuideTour = await GuideTour.findOne({
      where: {
        travel_tour_id: travel_tour_id,
        travel_guide_id: travel_guide_id,
      },
    });

    if (existingGuideTour) {
      return res
        .status(200)
        .json({ message: "Hướng dẫn viên đã được gán cho tour này!" });
    }

    // Tạo mới gán hướng dẫn viên cho tour
    const newGuideTour = await GuideTour.create({
      travel_tour_id,
      travel_guide_id,
      status: 0,
    });

    res.status(201).json({
      message: "Thêm hướng dẫn viên vào tour thành công!",
      data: newGuideTour,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm hướng dẫn viên vào tour!",
      error: error.message,
    });
  }
};

// Xóa hướng dẫn viên khỏi tour
exports.removeGuideFromTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }

    await guideTour.destroy();

    res.status(200).json({
      message: "Xóa hướng dẫn viên khỏi tour thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa hướng dẫn viên khỏi tour!",
      error: error.message,
    });
  }
};

exports.approveGuideTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }
    const travelGuide = await TravelGuide.findByPk(guideTour.travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }
    const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }
    // if (travelTour.status === 0) {
    //   travelTour.status = 1;
    //   await travelTour.save();
    // } else {
    //   return res
    //     .status(400)
    //     .json({ message: "Tour đã có người nhận!" });
    // }
    guideTour.status = 1;
    await guideTour.save();

    res.status(200).json({
      message: "Duyệt hướng dẫn viên thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi duyệt hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.rejectGuideTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }
    const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }
    if (travelTour.status === 1) {
      travelTour.status = 0;
      await travelTour.save();
    }
    guideTour.status = 2;
    await guideTour.save();

    res.status(200).json({
      message: "Từ chối hướng dẫn viên thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi từ chối hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.getGuideTourByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      page = 1,
      limit = 10,
      start_location_id,
      end_location_id,
      name_tour,
      start_day,
      status,
      upcoming,
    } = req.query;
    const travelGuide = await TravelGuide.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Tạo điều kiện where cho Tour
    const tourWhereCondition = {};
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

    // Tạo điều kiện where cho TravelTour
    const travelTourWhereCondition = {};
    if (start_day) {
      travelTourWhereCondition.start_day = {
        [Op.gte]: new Date(start_day),
      };
    }

    // Filter theo status
    if (status) {
      travelTourWhereCondition.status = status;
    }

    // Filter tour sắp diễn ra (trong 7 ngày tới)
    if (upcoming === "true") {
      const now = new Date();
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(now.getDate() + 7);

      travelTourWhereCondition.start_day = {
        [Op.between]: [now, sevenDaysLater],
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: guideTours } = await GuideTour.findAndCountAll({
      where: { travel_guide_id: travelGuide.id },
      include: [
        {
          model: TravelTour,
          as: "travelTour",
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
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    // Format lại dữ liệu trả về
    const formattedGuideTours = guideTours.map((guideTour) => {
      const guideTourData = guideTour.get({ plain: true });
      return {
        ...guideTourData,
        travel_tour: {
          ...guideTourData.travelTour,
          tour: {
            ...guideTourData.travelTour.Tour,
            start_location: guideTourData.travelTour.Tour.startLocation || null,
            end_location: guideTourData.travelTour.Tour.endLocation || null,
          },
        },
      };
    });

    res.status(200).json({
      message: "Lấy danh sách tour của hướng dẫn viên thành công!",
      data: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        items: formattedGuideTours,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.getTravelTourDetailForGuide = async (req, res) => {
  try {
    const { travelTourId } = req.params;

    // Lấy thông tin tour du lịch
    const travelTour = await TravelTour.findOne({
      where: { id: travelTourId },
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
      return res.status(200).json({ message: "Không tìm thấy tour du lịch!" });
    }

    // Lấy thông tin hướng dẫn viên của tour
    const guideTours = await GuideTour.findAll({
      where: { travel_tour_id: travelTourId },
      include: [
        {
          model: TravelGuide,
          as: "travelGuide",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
      ],
    });
    const bookings = await Booking.findAll({
      where: { travel_tour_id: travelTourId },
    });

    // Format lại dữ liệu trả về
    const formattedTravelTour = {
      id: travelTour.id,
      tour_id: travelTour.tour_id,
      start_day: travelTour.start_day,
      end_day: travelTour.end_day,
      status: travelTour.status,
      active: travelTour.active,
      price: travelTour.price,
      current_people: travelTour.current_people,
      max_people: travelTour.max_people,
      tour: {
        id: travelTour.Tour.id,
        name_tour: travelTour.Tour.name_tour,
        start_location: travelTour.Tour.startLocation,
        end_location: travelTour.Tour.endLocation,
      },
      guides: guideTours.map((guideTour) => ({
        id: guideTour.travelGuide.id,
        gender: guideTour.travelGuide.gender_guide,
        first_name: guideTour.travelGuide.first_name,
        last_name: guideTour.travelGuide.last_name,
        email: guideTour.travelGuide.email,
        phone: guideTour.travelGuide.number_phone,
        address: guideTour.travelGuide.address,
        avatar: guideTour.travelGuide.user.avatar,
        display_name: guideTour.travelGuide.user.displayName,
      })),
      bookings: bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        number_children: booking.number_children,
        number_adult: booking.number_adult,
        number_toddler: booking.number_toddler,
        number_newborn: booking.number_newborn,
        booking_date: booking.booking_date,
        total_cost: booking.total_cost,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        note: booking.note,
        booking_code: booking.booking_code,
      })),
    };

    res.json({
      message: "Lấy thông tin tour du lịch thành công!",
      data: formattedTravelTour,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin tour du lịch",
      error: error.message,
    });
  }
};
exports.assignPassengerToGuideAuto = async (req, res) => {
  try {
    const { number_passenger, travel_tour_id } = req.body;

    // Hàm tính tuổi từ ngày sinh
    const calculateAge = (birth_date) => {
      const birthDate = new Date(birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    };

    // Kiểm tra tour du lịch tồn tại
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(200).json({ message: "Không tìm thấy lịch khởi hành!" });
    }

    // Lấy danh sách hướng dẫn viên của tour
    const guideTours = await GuideTour.findAll({
      where: {
        travel_tour_id: travel_tour_id,
        status: 1 // Chỉ lấy hướng dẫn viên đã được duyệt
      },
      include: [
        {
          model: TravelGuide,
          as: "travelGuide",
          include: [
            {
              model: User,
              as: "user",
            }
          ]
        }
      ]
    });

    if (!guideTours || guideTours.length === 0) {
      return res.status(200).json({ message: "Không tìm thấy hướng dẫn viên cho tour này!" });
    }

    // Lấy danh sách booking của tour
    const bookings = await Booking.findAll({
      where: {
        travel_tour_id: travel_tour_id,
        status: 2 // Chỉ lấy booking đã thanh toán
      }
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: "Không tìm thấy booking cho tour này!" });
    }

    // Lấy danh sách hành khách cho từng booking
    const bookingsWithPassengers = await Promise.all(bookings.map(async (booking) => {
      const passengers = await Passenger.findAll({
        where: { booking_id: booking.id }
      });

      // Tính số hành khách trên 2 tuổi
      const countablePassengers = passengers.filter(p => calculateAge(p.birth_date) >= 2).length;

      return {
        ...booking.toJSON(),
        passenger: passengers,
        countablePassengers,
        totalPassengers: passengers.length
      };
    }));

    // Lọc các booking có hành khách
    const validBookings = bookingsWithPassengers.filter(booking => booking.passenger && booking.passenger.length > 0);

    if (validBookings.length === 0) {
      return res.status(200).json({ message: "Không tìm thấy hành khách hợp lệ cho tour này!" });
    }

    // Tính tổng số hành khách (chỉ tính người từ 2 tuổi trở lên)
    let totalCountablePassengers = validBookings.reduce((sum, booking) => sum + booking.countablePassengers, 0);
    let totalActualPassengers = validBookings.reduce((sum, booking) => sum + booking.totalPassengers, 0);

    // Khởi tạo các nhóm
    let groups = [{ currentCount: 0, passengers: [], actualCount: 0 }];
    let currentGroupIndex = 0;

    // Sắp xếp booking theo số lượng hành khách tính vào sức chứa (từ lớn đến nhỏ)
    validBookings.sort((a, b) => b.countablePassengers - a.countablePassengers);

    // Phân nhóm hành khách
    for (const booking of validBookings) {
      const countableSize = booking.countablePassengers;
      const allPassengers = booking.passenger;

      // Nếu số hành khách tính vào sức chứa trong booking lớn hơn sức chứa mỗi xe
      if (countableSize > number_passenger) {
        // Tạo các nhóm mới cho booking lớn
        let remainingPassengers = [...allPassengers];
        let currentCountable = remainingPassengers.filter(p => calculateAge(p.birth_date) >= 2).length;

        while (remainingPassengers.length > 0) {
          if (groups[currentGroupIndex].currentCount >= number_passenger) {
            groups.push({ currentCount: 0, passengers: [], actualCount: 0 });
            currentGroupIndex++;
          }

          // Tính toán số hành khách có thể thêm vào nhóm hiện tại
          const spaceLeft = number_passenger - groups[currentGroupIndex].currentCount;
          let passengersToAdd = [];
          let countableInGroup = 0;

          // Thêm hành khách vào nhóm cho đến khi đạt giới hạn số người tính vào sức chứa
          for (let i = 0; i < remainingPassengers.length; i++) {
            const passenger = remainingPassengers[i];
            if (calculateAge(passenger.birth_date) >= 2) {
              if (countableInGroup >= spaceLeft) break;
              countableInGroup++;
            }
            passengersToAdd.push(passenger);
          }

          // Cập nhật remainingPassengers
          remainingPassengers = remainingPassengers.slice(passengersToAdd.length);

          // Thêm hành khách vào nhóm
          groups[currentGroupIndex].passengers.push(...passengersToAdd);
          groups[currentGroupIndex].currentCount += passengersToAdd.filter(p => calculateAge(p.birth_date) >= 2).length;
          groups[currentGroupIndex].actualCount += passengersToAdd.length;
        }
      } else {
        // Tìm nhóm phù hợp cho booking
        let foundGroup = false;
        for (let i = 0; i <= currentGroupIndex; i++) {
          if (groups[i].currentCount + countableSize <= number_passenger) {
            groups[i].passengers.push(...allPassengers);
            groups[i].currentCount += countableSize;
            groups[i].actualCount += allPassengers.length;
            foundGroup = true;
            break;
          }
        }

        // Nếu không tìm được nhóm phù hợp, tạo nhóm mới
        if (!foundGroup) {
          groups.push({
            currentCount: countableSize,
            passengers: [...allPassengers],
            actualCount: allPassengers.length
          });
          currentGroupIndex++;
        }
      }
    }

    // Kiểm tra số hướng dẫn viên có đủ không
    if (guideTours.length < groups.length) {
      return res.status(200).json({
        message: `Số hướng dẫn viên không đủ! Cần ${groups.length} hướng dẫn viên nhưng chỉ có ${guideTours.length} hướng dẫn viên.`
      });
    }

    // Cập nhật group cho hướng dẫn viên
    for (let i = 0; i < guideTours.length; i++) {
      await guideTours[i].update({ group: i < groups.length ? i + 1 : null });
    }

    // Cập nhật group cho hành khách
    for (let i = 0; i < groups.length; i++) {
      const groupNumber = i + 1;
      for (const passenger of groups[i].passengers) {
        await passenger.update({ group: groupNumber });
      }
    }

    // Format thông tin hướng dẫn viên
    const formattedGuides = guideTours.map(guideTour => ({
      id: guideTour.travelGuide.id,
      group: guideTour.group,
      number_phone: guideTour.travelGuide.number_phone,
      gender_guide: guideTour.travelGuide.gender_guide,
      first_name: guideTour.travelGuide.first_name,
      last_name: guideTour.travelGuide.last_name,
      birth_date: guideTour.travelGuide.birth_date,
    }));

    res.status(200).json({
      message: "Phân công xe tự động thành công!",
      data: {
        totalCountablePassengers,
        totalActualPassengers,
        numberOfGroups: groups.length,
        numberOfGuides: guideTours.length,
        numberOfBookings: validBookings.length,
        guides: formattedGuides,
        groups: groups.map((group, index) => ({
          groupNumber: index + 1,
          countablePassengers: group.currentCount,
          actualPassengers: group.actualCount,
          passengers: group.passengers.map(p => ({
            id: p.id,
            name: p.name,
            birth_date: p.birth_date,
            age: calculateAge(p.birth_date)
          }))
        }))
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi phân công xe tự động!",
      error: error.message,
    });
  }
};

// Gán TravelGuide cho TravelTour
exports.assignMoreTravelGuideToTravelTour = async (req, res) => {
  try {
    const { travel_tour_id, travel_guide_id, group_name, isLeader } = req.body;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await db.TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Kiểm tra xem TravelGuide đã được gán cho TravelTour này chưa
    const existingAssignment = await db.GuideTour.findOne({
      where: { travel_tour_id, travel_guide_id },
    });
    if (existingAssignment) {
      return res.status(400).json({
        message: "TravelGuide đã được gán cho TravelTour này!",
      });
    }

    // Kiểm tra xem TravelGuide có bị trùng lịch với TravelTour khác không
    const overlappingAssignments = await db.GuideTour.findAll({
      where: {
        travel_guide_id,
      },
      include: [
        {
          model: db.TravelTour,
          as: "travelTour",
          where: {
            [Op.or]: [
              {
                start_day: {
                  [Op.between]: [travelTour.start_day, travelTour.end_day],
                },
              },
              {
                end_day: {
                  [Op.between]: [travelTour.start_day, travelTour.end_day],
                },
              },
              {
                [Op.and]: [
                  { start_day: { [Op.lte]: travelTour.start_day } },
                  { end_day: { [Op.gte]: travelTour.end_day } },
                ],
              },
            ],
          },
        },
      ],
    });

    if (overlappingAssignments.length > 0) {
      return res.status(400).json({
        message:
          "TravelGuide đã được gán cho một TravelTour khác trong khoảng thời gian này!",
        data: overlappingAssignments.map((assignment) => ({
          travel_tour_id: assignment.travel_tour_id,
          start_day: assignment.travelTour.start_day,
          end_day: assignment.travelTour.end_day,
        })),
      });
    }

    // Thêm TravelGuide vào nhóm
    const newAssignment = await db.GuideTour.create({
      travel_tour_id,
      travel_guide_id,
      group_name,
      isLeader: isLeader || false,
      status: 0, // 0: Chưa xác nhận, 1: Đã xác nhận
    });

    // Nếu isLeader là true, cập nhật các hướng dẫn viên khác trong nhóm không còn là leader
    if (isLeader) {
      await db.GuideTour.update(
        { isLeader: false },
        {
          where: {
            travel_tour_id,
            travel_guide_id: { [Op.ne]: travel_guide_id },
          },
        }
      );
    }

    // Cập nhật số lượng assigned_guides
    travelTour.assigned_guides += 1;

    // Kiểm tra trạng thái guide_assignment_status
    if (travelTour.assigned_guides === travelTour.required_guides) {
      travelTour.guide_assignment_status = "gan_du";
    } else {
      travelTour.guide_assignment_status = "gan_thieu";
    }

    await travelTour.save();

    res.status(201).json({
      message: "Thêm TravelGuide vào nhóm thành công!",
      data: newAssignment,
    });
  } catch (error) {
    console.error("Lỗi khi thêm TravelGuide vào nhóm:", error);
    res.status(500).json({
      message: "Lỗi khi thêm TravelGuide vào nhóm!",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái của GuideTour --Trạng thái mới: 1 (đồng ý), 2 (từ chối)
exports.confirmGuideTour = async (req, res) => {
  try {
    const { guide_tour_id } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (![1, 2].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Tìm GuideTour theo ID
    const guideTour = await db.GuideTour.findByPk(guide_tour_id);
    if (!guideTour) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên trong lịch khởi hành!",
      });
    }

    // Cập nhật trạng thái
    guideTour.status = status;
    await guideTour.save();

    // Nếu trạng thái là từ chối (2), có thể thực hiện thêm logic nếu cần
    if (status === 2) {
      const travelTour = await db.TravelTour.findByPk(guideTour.travel_tour_id);
      if (travelTour) {
        travelTour.status = 0;
        await travelTour.save();
      }
    }

    res.status(200).json({
      message: `Cập nhật trạng thái hướng dẫn viên trong lịch khởi hành thành công!`,
      data: guideTour,
    });
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái hướng dẫn viên trong lịch khởi hành:",
      error
    );
    res.status(500).json({
      message:
        "Lỗi khi cập nhật trạng thái hướng dẫn viên trong lịch khởi hành!",
      error: error.message,
    });
  }
};

// Gán nhiều TravelGuide vào một TravelTour
exports.assignTravelGuidesToTravelTour = async (req, res) => {
  try {
    const { travel_tour_id, guides, group_name } = req.body;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await db.TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Kiểm tra danh sách guides
    if (!Array.isArray(guides) || guides.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách guides không hợp lệ!" });
    }

    // Kiểm tra từng guide
    const travelGuideIds = guides.map((guide) => guide.travel_guide_id);
    const travelGuides = await db.TravelGuide.findAll({
      where: { id: travelGuideIds },
    });

    if (travelGuides.length !== guides.length) {
      return res.status(400).json({
        message: "Một hoặc nhiều TravelGuide không tồn tại!",
      });
    }

    // Kiểm tra lịch trình trùng lặp
    const conflictingGuides = [];
    for (const guide of guides) {
      const overlappingAssignments = await db.GuideTour.findAll({
        where: {
          travel_guide_id: guide.travel_guide_id,
        },
        include: [
          {
            model: db.TravelTour,
            as: "travelTour",
            where: {
              [Op.or]: [
                {
                  start_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  end_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  [Op.and]: [
                    { start_day: { [Op.lte]: travelTour.start_day } },
                    { end_day: { [Op.gte]: travelTour.end_day } },
                  ],
                },
              ],
            },
          },
        ],
      });

      if (overlappingAssignments.length > 0) {
        conflictingGuides.push({
          travel_guide_id: guide.travel_guide_id,
          conflicts: overlappingAssignments.map((assignment) => ({
            travel_tour_id: assignment.travel_tour_id,
            start_day: assignment.travelTour.start_day,
            end_day: assignment.travelTour.end_day,
          })),
        });
      }
    }

    if (conflictingGuides.length > 0) {
      return res.status(400).json({
        message: "Một hoặc nhiều TravelGuide có lịch trình trùng lặp!",
        data: conflictingGuides,
      });
    }

    // Kiểm tra số lượng hướng dẫn viên được gán
    const currentAssignedGuides = await db.GuideTour.count({
      where: { travel_tour_id },
    });

    if (currentAssignedGuides + guides.length > travelTour.required_guides) {
      return res.status(400).json({
        message: "Bạn đã gán quá số người quy định!",
      });
    }

    // Gán các TravelGuide vào TravelTour
    const assignments = guides.map((guide) => ({
      travel_tour_id,
      travel_guide_id: guide.travel_guide_id,
      group_name,
      isLeader: guide.isLeader || false,
      status:1
    }));

    await db.GuideTour.bulkCreate(assignments);

    // Cập nhật số lượng assigned_guides
    const totalAssignedGuides = currentAssignedGuides + guides.length;
    travelTour.assigned_guides = totalAssignedGuides;

    if (totalAssignedGuides === travelTour.required_guides) {
      travelTour.guide_assignment_status = "gan_du";
    } else {
      travelTour.guide_assignment_status = "gan_thieu";
    }

    await travelTour.save();

    res.status(200).json({
      message:
        totalAssignedGuides === travelTour.required_guides
          ? "Phân chia nhóm TravelGuide thành công! Đã gán đủ số lượng yêu cầu."
          : "Phân chia nhóm TravelGuide thành công! Nhưng chưa đủ số lượng yêu cầu.",
      data: assignments,
    });
  } catch (error) {
    console.error("Lỗi khi phân chia nhóm TravelGuide:", error);
    res.status(500).json({
      message: "Lỗi khi phân chia nhóm TravelGuide!",
      error: error.message,
    });
  }
};

// Xóa nhiều TravelGuide khỏi một TravelTour
exports.unassignTravelGuidesToTravelTour = async (req, res) => {
  try {
    const { travel_tour_id, travel_guide_ids } = req.body;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await db.TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Kiểm tra nếu TravelTour đã khởi hành
    const now = new Date();
    if (new Date(travelTour.start_day) <= now) {
      return res.status(400).json({
        message: "Không thể xóa vì TravelTour đã khởi hành!",
      });
    }

    // Kiểm tra danh sách travel_guide_ids
    if (!Array.isArray(travel_guide_ids) || travel_guide_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách travel_guide_ids không hợp lệ!" });
    }

    // Lấy danh sách GuideTour tương ứng
    const guideTours = await db.GuideTour.findAll({
      where: {
        travel_tour_id,
        travel_guide_id: travel_guide_ids,
      },
    });

    if (guideTours.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên nào trong lịch khởi hành!",
      });
    }

    // Xóa các GuideTour chưa được xác nhận
    const deletedCount = await db.GuideTour.destroy({
      where: {
        travel_tour_id,
        travel_guide_id: travel_guide_ids,
        status: 0, // Chỉ xóa các GuideTour chưa được xác nhận
      },
    });

    if (deletedCount === 0) {
      return res.status(400).json({
        message: "Không có hướng dẫn viên nào đủ điều kiện để xóa!",
      });
    }

    // Cập nhật số lượng assigned_guides
    travelTour.assigned_guides -= deletedCount;

    // Kiểm tra trạng thái guide_assignment_status
    if (travelTour.assigned_guides === 0) {
      travelTour.guide_assignment_status = "chua_gan";
    } else if (travelTour.assigned_guides < travelTour.required_guides) {
      travelTour.guide_assignment_status = "gan_thieu";
    } else {
      travelTour.guide_assignment_status = "gan_du";
    }

    await travelTour.save();

    res.status(200).json({
      message: "Xóa hướng dẫn viên khỏi lịch khởi hành thành công!",
      deletedCount,
    });
  } catch (error) {
    console.error("Lỗi khi xóa hướng dẫn viên khỏi lịch khởi hành:", error);
    res.status(500).json({
      message: "Lỗi khi xóa hướng dẫn viên khỏi lịch khởi hành!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide có lịch trình trống cho một TravelTour
exports.getAvailableTravelGuidesForTour = async (req, res) => {
  try {
    const { travel_tour_id } = req.params;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Lấy danh sách tất cả TravelGuide
    const allTravelGuides = await TravelGuide.findAll();

    // Lọc các TravelGuide không có lịch trình trùng
    const availableTravelGuides = [];
    for (const guide of allTravelGuides) {
      const overlappingAssignments = await GuideTour.findAll({
        where: {
          travel_guide_id: guide.id,
        },
        include: [
          {
            model: TravelTour,
            as: "travelTour",
            where: {
              [Op.or]: [
                {
                  start_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  end_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  [Op.and]: [
                    { start_day: { [Op.lte]: travelTour.start_day } },
                    { end_day: { [Op.gte]: travelTour.end_day } },
                  ],
                },
              ],
            },
          },
        ],
      });

      if (overlappingAssignments.length === 0) {
        availableTravelGuides.push(guide);
      }
    }

    res.status(200).json({
      message: "Lấy danh sách TravelGuide trống lịch thành công!",
      data: availableTravelGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelGuide trống lịch:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelGuide trống lịch!",
      error: error.message,
    });
  }
};

// Cập nhật thông tin nhóm hướng dẫn viên trong một TravelTour
exports.updateTravelGuideGroup = async (req, res) => {
  try {
    const { travel_tour_id, group_name, guides } = req.body;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await db.TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Kiểm tra danh sách guides
    if (!Array.isArray(guides) || guides.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách guides không hợp lệ!" });
    }

    // Cập nhật tên nhóm nếu có
    if (group_name) {
      await db.GuideTour.update({ group_name }, { where: { travel_tour_id } });
    }

    let hasLeader = false;

    // Xử lý từng guide trong danh sách
    for (const guide of guides) {
      const { travel_guide_id, isLeader } = guide;

      // Kiểm tra GuideTour có tồn tại không
      const guideTour = await db.GuideTour.findOne({
        where: { travel_tour_id, travel_guide_id },
      });

      if (!guideTour) {
        return res.status(404).json({
          message: `Không tìm thấy hướng dẫn viên với ID ${travel_guide_id} trong nhóm!`,
        });
      }

      // Cập nhật quyền leader
      if (isLeader !== undefined) {
        if (isLeader) {
          // Xóa quyền leader hiện tại (nếu có)
          await db.GuideTour.update(
            { isLeader: false },
            { where: { travel_tour_id, isLeader: true } }
          );
          hasLeader = true;
        }
        guideTour.isLeader = isLeader;
      }

      // Lưu thay đổi
      await guideTour.save();
    }

    // Kiểm tra nếu không có leader nào được chỉ định
    if (!hasLeader) {
      const currentLeader = await db.GuideTour.findOne({
        where: { travel_tour_id, isLeader: true },
      });

      if (!currentLeader) {
        return res.status(400).json({
          message: "Nhóm phải có ít nhất một leader!",
        });
      }
    }

    res.status(200).json({
      message: "Cập nhật thông tin nhóm thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin nhóm:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin nhóm!",
      error: error.message,
    });
  }
};

exports.getAvailableTravelGuidesForTourByLocation = async (req, res) => {
  try {
    const { travel_tour_id } = req.params;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await TravelTour.findByPk(travel_tour_id, {
      include: [
        {
          model: Tour,
          as: "Tour",
          attributes: ["start_location", "end_location"],
        },
      ],
    });

    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Lấy location_id từ TravelTour (start_location hoặc end_location)
    const locationIds = [
      travelTour.Tour.start_location,
      travelTour.Tour.end_location,
    ];

    // Lấy danh sách tất cả TravelGuide thuộc các location của TravelTour
    let allTravelGuides = await TravelGuide.findAll({
      include: [
        {
          model: db.TravelGuideLocation,
          as: "TravelGuideLocations",
          where: {
            location_id: { [Op.in]: locationIds },
          },
          include: [
            {
              model: db.Location,
              as: "location",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });

    // Lọc các TravelGuide không có lịch trình trùng
    const availableTravelGuides = [];
    for (const guide of allTravelGuides) {
      const overlappingAssignments = await GuideTour.findAll({
        where: {
          travel_guide_id: guide.id,
        },
        include: [
          {
            model: TravelTour,
            as: "travelTour",
            where: {
              [Op.or]: [
                {
                  start_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  end_day: {
                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                  },
                },
                {
                  [Op.and]: [
                    { start_day: { [Op.lte]: travelTour.start_day } },
                    { end_day: { [Op.gte]: travelTour.end_day } },
                  ],
                },
              ],
            },
          },
        ],
      });

      if (overlappingAssignments.length === 0) {
        availableTravelGuides.push(guide);
      }
    }

    res.status(200).json({
      message: "Lấy danh sách TravelGuide trống lịch thành công!",
      data: availableTravelGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelGuide trống lịch:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelGuide trống lịch!",
      error: error.message,
    });
  }
};
