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

        // Gửi câu hỏi đến Gemini AI
        const result = await chatSession.sendMessage(question);
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
