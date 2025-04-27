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
        const tours = await db.Tour.findAll(
        );
        const question2 = 'Bạn là một trợ lý thông minh tìm các tour du lịch, hãy trả lời câu hỏi của người dùng dựa trên nội dung của danh sách tour du lịch sau: ' + JSON.stringify(tours) + '. Hãy đưa ra gợi ý cho người dùng về tour du lịch phù hợp nhất, đính kèm ảnh và link của tour du lịch theo dạng http://localhost:5173/tour/tour_id. Trả về cho tôi dạng html. Câu hỏi của người dùng là: ' + question;
        // Gửi câu hỏi đến Gemini AI
        const result = await chatSession.sendMessage(question2);
        const text = await result.response.text(); // Lấy text từ response

        console.log(text);

        res.json({
            message: "OK",
            data: text,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error asking!",
            error: error.message,
        });
    }
};
