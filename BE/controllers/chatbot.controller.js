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
const tourKeywords = ["tour", "đi đâu", "du lịch", "chuyến đi", "đặt tour"];

const containsTourKeyword = (question) => {
    const lowerQuestion = question.toLowerCase();
    return tourKeywords.some(keyword => lowerQuestion.includes(keyword));
  };
  // Danh sách từ khóa + điểm
const tourKeywordScores = [
    { keyword: "tour", score: 5 },
    { keyword: "đi đâu", score: 4 },
    { keyword: "du lịch", score: 5 },
    { keyword: "chuyến đi", score: 3 },
    { keyword: "đặt tour", score: 5 },
    { keyword: "gợi ý chuyến đi", score: 4 },
    { keyword: "nên đi đâu", score: 4 },
    { keyword: "chương trình tham quan", score: 3 },
    { keyword: "địa điểm du lịch", score: 4 },
  ];
  
  // Hàm tính tổng điểm
  const calculateTourScore = (question) => {
    const lowerQuestion = question.toLowerCase();
    let totalScore = 0;
    for (const { keyword, score } of tourKeywordScores) {
      if (lowerQuestion.includes(keyword)) {
        totalScore += score;
      }
    }
    return totalScore;
  };
  exports.askChatBot = async (req, res) => {
    try {
      const { question } = req.body;
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      const score = calculateTourScore(question);
      const threshold = 5; // Ngưỡng: nếu điểm >= 5 thì xem như câu hỏi liên quan tour
  
      let prompt = "";
  
      if (score >= threshold) {
        // Liên quan tour => gửi toursData
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
  
        const toursData = tours.map(tour => ({
          id: tour.id,
          name: tour.name_tour,
          startLocation: tour.startLocation?.name_location,
          album: tour.album ? tour.album[0] : null, 
        }));
  
        prompt = `
          Bạn là trợ lý du lịch thông minh. Dưới đây là danh sách các tour: ${JSON.stringify(toursData)}.
  
          Yêu cầu:
          - Nếu người dùng hỏi về tour, hãy gợi ý 1 hoặc nhiều tour phù hợp nhất.
          - Với mỗi tour gợi ý, tạo HTML gồm: <div> chứa <img> ảnh đầu tiên, <b>tên tour</b> và <a>link http://localhost:5173/tour/{id} và làm sao để có thể click vào ảnh và tên tour để điều hướng.
          - Chỉ trả về HTML thuần, không dùng MarkDown Syntax và không có mấy kí tự lỗi như kiểu 3 dấu backtick để đầu và cuối response.
          - Thân thiện, giới thiệu cụ thể, văn hay chữ tốt về tour.
  
          Câu hỏi: "${question}"
        `;
      } else {
        // Không liên quan tour => chỉ prompt nhẹ nhàng
        prompt = `
          Bạn là một trợ lý du lịch thông minh.
  
          Trả lời câu hỏi của người dùng ngắn gọn, thân thiện, dưới dạng HTML (<b>, <i>, <ul>, <li>...).
          Yêu cầu bắt buộc:
          - Chỉ trả lời bằng HTML đơn giản (sử dụng các thẻ như <b>, <i>, <ul>, <li>, <p>, <div>, <br> nếu cần).
          - **KHÔNG được sử dụng Markdown**.
          - **KHÔNG được bao quanh nội dung bằng bất kỳ ký tự đặc biệt nào**, đặc biệt là không dùng \`\`\`, không dùng \`\`\`html, không dùng dấu sao (*), dấu gạch đầu dòng (-), hoặc các ký hiệu định dạng văn bản.
          - **KHÔNG thêm lời giải thích, không nói "Câu trả lời:"**, chỉ trả về đoạn HTML phù hợp.
          - Trả về duy nhất phần nội dung HTML, KHÔNG có mô tả, KHÔNG có ví dụ, KHÔNG có chú thích.
          Câu hỏi: "${question}"
        `;
      }
  
      const result = await chatSession.sendMessage(prompt);
      const text = await result.response.text();
      let cleanText = text.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```[a-z]*\n?/g, "").replace(/```$/g, "").trim();
      }
      res.json({
        message: "OK",
        data: cleanText,
        score: score,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error asking!",
        error: error.message,
      });
    }
  };
  

// exports.askChatBot = async (req, res) => {
//     try {
//       const { question } = req.body;
  
//       const chatSession = model.startChat({
//         generationConfig,
//         history: [],
//       });
  
//       let prompt = "";
  
//       if (containsTourKeyword(question)) {
//         // Nếu câu hỏi liên quan tour => lấy toursData
//         const tours = await db.Tour.findAll({
//           include: [
//             {
//               model: db.TourActivities,
//               as: "tourActivities",
//               attributes: ["id", "title", "description", "detail", "image"],
//             },
//             {
//               model: db.Location,
//               as: "startLocation",
//               attributes: ["id", "name_location"],
//             },
//           ],
//           attributes: ['id', 'name_tour', 'activity_description', 'album']
//         });
//         const toursData = tours.map(tour => ({
//           id: tour.id,
//           name: tour.name_tour,
//           startLocation: tour.startLocation?.name_location,
//           album: tour.album ? JSON.parse(tour.album)[0] : null, 
//         }));
  
//         prompt = `
//           Bạn là trợ lý du lịch thông minh. Dưới đây là danh sách các tour: ${JSON.stringify(toursData)}.
  
//           Yêu cầu:
//           - Nếu người dùng hỏi về tour, hãy gợi ý 1 hoặc nhiều tour phù hợp nhất.
//           - Với mỗi tour gợi ý, tạo HTML gồm: <div> chứa <img> ảnh đầu tiên, <b>tên tour</b> và <a>link http://localhost:5173/tour/{id}.
//           - Chỉ trả về HTML thuần, không viết thêm chữ giới thiệu.
//           - Thân thiện, ngắn gọn.
  
//           Câu hỏi: "${question}"
//         `;
//       } else {
//         // Nếu không liên quan tour => prompt đơn giản
//         prompt = `
//           Bạn là một trợ lý du lịch thông minh.
  
//           Trả lời câu hỏi của người dùng ngắn gọn, thân thiện, dễ hiểu, dưới dạng HTML thuần (<b>, <i>, <ul>, <li>, ...).
          
//           Câu hỏi: "${question}"
//         `;
//       }
  
//       // Gửi câu hỏi đến Gemini
//       const result = await chatSession.sendMessage(prompt);
//       const text = await result.response.text();
  
//       res.json({
//         message: "OK",
//         data: text,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Error asking!",
//         error: error.message,
//       });
//     }
//   };
  
