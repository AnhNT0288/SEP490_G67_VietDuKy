import restClient from "../restClient";

export const ChatBotService = {
    askChatBot: (data) => {
        return restClient({
            url: "/chatbot/ask",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        })
    }
};