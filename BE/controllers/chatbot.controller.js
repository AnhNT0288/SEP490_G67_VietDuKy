const db = require("../models");
const {GoogleGenerativeAI} = require("@google/generative-ai"); // Đổi import thành require
require("dotenv").config();

const apiKey = process.env.GEMINI_API;

// Khởi tạo AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

exports.askChatBot = async (req, res) => {
    try {
        const {question} = req.body;

        // Bắt đầu phiên chat
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const tours = await db.Tour.findAll({
            include: [
                {
                    model: db.TourActivities,
                    as: "tourActivities",
                    attributes: ["id", "title", "description", "detail", "image"],
                },
                {
                    model: db.Location,
                    as: "startLocation",
                    attributes: ["id", "name_location"],
                },
            ],
            attributes: ['id', 'name_tour', 'activity_description', 'album']
        });
        const toursData = tours.map(tour => tour.toJSON());
        const question2 = `
    Bạn là một trợ lý du lịch thông minh. Dưới đây là danh sách các tour du lịch: ${JSON.stringify(toursData)}.
    - Nếu người dùng hỏi về tour, hãy gợi ý tour phù hợp nhất, trả về 1 đoạn html bao trong thẻ <a> để khi nhấn vào sẽ ra trang tour, kèm ảnh, link dạng http://localhost:5173/tour/tour_id.
    - Nếu không liên quan tour, trả lời tự nhiên, không nhắc đến tour.
    - Trả về kết quả dạng HTML, có thể dùng thẻ <img>, <a>, <b>, <ul>, <li>...
    - Luôn trả lời thân thiện, ngắn gọn, dễ hiểu.
    Câu hỏi của người dùng: ${question}
  `;
        // Gửi câu hỏi đến Gemini AI
        const result = await chatSession.sendMessage(question2);
        const text = await result.response.text(); // Lấy text từ response

        console.log(text);

        res.json({
            message: "OK",
            data: text,
            toursData: toursData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error asking!",
            error: error.message,
        });
    }
};
