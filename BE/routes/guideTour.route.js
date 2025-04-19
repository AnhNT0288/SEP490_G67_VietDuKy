const express = require("express");
const router = express.Router();
const GuideTourController = require("../controllers/guideTour.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/:id", GuideTourController.getGuideTours);
router.post(
  "/create",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.addGuideToTour
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles("admin", "staff"),
  GuideTourController.removeGuideFromTour
);
router.put(
  "/approve/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.approveGuideTour
);
router.put(
  "/reject/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.rejectGuideTour
);
router.get(
  "/user/:id",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.getGuideTourByUserId
);
router.get(
  "/travel-tour/:travelTourId",
  // authenticateUser,
  // authenticateAdmin,
  GuideTourController.getTravelTourDetailForGuide
);

//TravelGuide xác nhận hoặc từ chối GuideTour
router.post(
  "/confirm-guide-tour/:guide_tour_id",
  // authenticateUser,
  // authenticateStaff,
  GuideTourController.confirmGuideTour
);

//Gán NHIỀU hướng dẫn viên cho tour
router.post(
  "/assign-guides-to-tour",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  GuideTourController.assignTravelGuidesToTravelTour
);

//Xóa NHIỀU hướng dẫn viên khỏi tour
router.post(
  "/unassign-guides-from-tour",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  GuideTourController.unassignTravelGuidesToTravelTour
);

// Cập nhật thông tin nhóm TravelGuide
router.put(
  "/update-travel-guide-group",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  GuideTourController.updateTravelGuideGroup
);

//Gán thêm 1 hướng dẫn viên cho tour
router.post(
  "/assign-travel-guide",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  GuideTourController.assignMoreTravelGuideToTravelTour
);

//Lấy danh sách hướng dẫn viên có thể tham gia tour
router.get(
  "/available-guides/:travel_tour_id",
  // authenticateUser,
  // checkRoles("admin", "staff"),
  GuideTourController.getAvailableTravelGuidesForTour
);

module.exports = router;
