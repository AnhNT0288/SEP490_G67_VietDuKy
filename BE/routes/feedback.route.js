const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");
const { uploadAlbumFeedback } = require("../utils/cloudinary");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/:userId", authenticateUser, feedbackController.getFeedbackByUser);
router.post(
  "/create/tour",
  // authenticateUser,
  uploadAlbumFeedback.array("feedback_album", 10),
  feedbackController.createFeedbackForTour
);
router.post(
  "/create/travel-guide",
  authenticateUser,
  uploadAlbumFeedback.array("feedback_album", 10),
  feedbackController.createFeedbackForTravelGuide
);
router.put(
  "/update/:id",
  authenticateUser,
  uploadAlbumFeedback.array("feedback_album", 10),
  feedbackController.updateFeedback
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles(["admin", "staff", "customer"]),
  feedbackController.deleteFeedback
);

router.get(
  "/tour/:tourId",
  // authenticateUser,
  feedbackController.getFeedbackByTourId
);

router.get(
  "/travel-guide/:travelGuideId",
  // authenticateUser,
  feedbackController.getFeedbackByTravelGuideId
);

router.get(
  "/admin/tour-feedbacks",
  // authenticateUser,
  // checkRoles(["admin"]),
  feedbackController.getAllTourFeedbacksForAdmin
);
module.exports = router;
