const express = require("express");
const router = express.Router();
const DirectoryController = require("../controllers/directory.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/", DirectoryController.getAllDirectories);
router.post("/create",authenticateUser, authenticateAdmin,  DirectoryController.createDirectory);
router.put(
  "/update/:id",
    authenticateUser,
  authenticateAdmin,
    DirectoryController.updateDirectory
);
router.delete(
  "/delete/:id",
    authenticateUser,
  authenticateAdmin,
    DirectoryController.deleteDirectory
);

module.exports = router;
