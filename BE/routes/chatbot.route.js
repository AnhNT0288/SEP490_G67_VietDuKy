const express = require("express");
const router = express.Router();
const ChatBotController = require("../controllers/chatbot.controller");

router.post("/ask", ChatBotController.askChatBot);
module.exports = router;
