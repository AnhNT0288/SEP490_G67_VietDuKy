const db = require("../models");
const Tour = db.Tour;
const TourInfo = db.TourInfo;

exports.createTourInfo = async (req, res) => {
    try {
        const { tour_id, tab, description } = req.body;
        const tourInfo = await TourInfo.create({ tour_id, tab, description });  
        res.status(201).json({message: "Thêm thông tin tour thành công", data: tourInfo});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getTourInfo = async (req, res) => {
    try {
        const { tour_id } = req.params;
        const tourInfo = await TourInfo.findAll({ where: { tour_id } });
        res.status(200).json({message: "Lấy thông tin tour thành công", data: tourInfo});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    
