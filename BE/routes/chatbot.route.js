const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.controller");

router.post("/ask", chatbotController.askChatBot);
router.get("/history/:user_id", chatbotController.getChatHistory);

module.exports = router;
