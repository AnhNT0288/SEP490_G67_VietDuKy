console.error = jest.fn();

const { askChatBot } = require('../controllers/chatbot.controller');
const db = require('../models');
const { Tour, Location } = db;

jest.mock('@google/generative-ai'); // Mock GoogleGenerativeAI
jest.mock('../models'); // Mock models

describe('Unit Test: askChatBot Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        question: "Tour du lịch Hà Nội",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking db methods
    db.Tour.findAll = jest.fn().mockResolvedValue([
      {
        id: 1,
        name_tour: "Tour Hà Nội",
        startLocation: { name_location: "Hà Nội" },
        album: '[{"image": "image_path.jpg"}]',
      },
    ]);

    db.Location.findAll = jest.fn().mockResolvedValue([
      {
        id: 1,
        name_location: "Hà Nội",
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should respond with HTML for tour-related questions', async () => {
    // Mock the Generative AI response
    const mockChatSession = {
      sendMessage: jest.fn().mockResolvedValue({
        response: {
          text: "<div><img src='image_path.jpg'><b>Tour Hà Nội</b><a href='http://localhost:5173/tour/1'>Xem chi tiết</a></div>",
        },
      }),
    };

    // Mock the Generative AI model
    const mockAI = {
      startChat: jest.fn().mockReturnValue(mockChatSession),
    };

    const originalGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI;
    require('@google/generative-ai').GoogleGenerativeAI = jest.fn().mockReturnValue(mockAI);

    // Call the controller directly with mock
    await askChatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "OK",
      data: "<div><img src='image_path.jpg'><b>Tour Hà Nội</b><a href='http://localhost:5173/tour/1'>Xem chi tiết</a></div>",
      score: expect.any(Number),
    });

    // Restore the original AI model
    require('@google/generative-ai').GoogleGenerativeAI = originalGetGenerativeModel;
  });

  it('should respond with a friendly HTML for non-tour related questions', async () => {
    req.body.question = "Thời gian làm việc của công ty";

    // Mock the Generative AI response
    const mockChatSession = {
      sendMessage: jest.fn().mockResolvedValue({
        response: {
          text: "<b>Thời gian làm việc: 9:00 AM - 6:00 PM</b>",
        },
      }),
    };

    // Mock the Generative AI model
    const mockAI = {
      startChat: jest.fn().mockReturnValue(mockChatSession),
    };

    const originalGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI;
    require('@google/generative-ai').GoogleGenerativeAI = jest.fn().mockReturnValue(mockAI);

    // Call the controller directly with mock
    await askChatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "OK",
      data: "<b>Thời gian làm việc: 9:00 AM - 6:00 PM</b>",
      score: expect.any(Number),
    });

    // Restore the original AI model
    require('@google/generative-ai').GoogleGenerativeAI = originalGetGenerativeModel;
  });

  it('should return error if something goes wrong with AI', async () => {
    // Mock the AI failure response
    const mockChatSession = {
      sendMessage: jest.fn().mockRejectedValue(new Error("AI Error")),
    };

    const mockAI = {
      startChat: jest.fn().mockReturnValue(mockChatSession),
    };

    const originalGetGenerativeModel = require('@google/generative-ai').GoogleGenerativeAI;
    require('@google/generative-ai').GoogleGenerativeAI = jest.fn().mockReturnValue(mockAI);

    await askChatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error asking!",
      error: "AI Error",
    });

    // Restore the original AI model
    require('@google/generative-ai').GoogleGenerativeAI = originalGetGenerativeModel;
  });
});
