const db = require("../models");
const Tour = db.Tour;
const Location = db.Location;
const TypeTour = db.TypeTour;
const TravelTour = db.TravelTour;

exports.getAllTypeTours = async (req, res) => {
    try {
        const typeTours = await TypeTour.findAll();
        res.json(typeTours);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createTypeTour = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({error: "Vui lòng nhập tên loại tour"});
        }

        const existingTypeTour = await TypeTour.findOne({
            where: {
                name_type: name,
            },
        });
        if (existingTypeTour) {
            return res.status(400).json({error: "Loại tour đã tồn tại"});
        }
        const newTypeTour = await TypeTour.create({
            name_type: name,
            description_type: description,
        });
        res.status(201).json({
            message: "Loại tour đã được tạo thành công",
            data: newTypeTour,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
