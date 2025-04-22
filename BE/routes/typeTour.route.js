const express = require("express");
const router = express.Router();
const typeTourController = require("../controllers/typeTour.controller");

router.get("/", typeTourController.getAllTypeTours);
router.post("/create", typeTourController.createTypeTour);

module.exports = router;
