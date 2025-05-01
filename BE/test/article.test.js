console.error = jest.fn();

const { getAllArticles, getArticleById, getArticlesByDirectory, createArticle, updateArticle, deleteArticle, incrementViews } = require('../controllers/article.controller');
const db = require('../models');
const { Article, User, Directory } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: Article Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {
                directory_id: 1,
                user_id: 1,
                article_name: "Test Article",
                article_title: "Test Title",
                description: "Test Description"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mock functions after each test
    });

    it('should return all articles successfully', async () => {
        // Mocking the result of finding all articles
        db.Article.findAll.mockResolvedValue([{ id: 1, article_name: "Test Article" }]);

        await getAllArticles(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Lấy danh sách tất cả bài viết thành công!",
            data: expect.any(Array)
        });
    });

    it('should return 404 if no article found by id', async () => {
        // Mocking the result of findByPk to return null (article not found)
        db.Article.findByPk.mockResolvedValue(null);

        req.params.article_id = 1; // Setting article_id to 1

        await getArticleById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Không tìm thấy bài viết!"
        });
    });

    it('should return articles by directory successfully', async () => {
        db.Article.findAll.mockResolvedValue([{ id: 1, article_name: "Article in Directory" }]);

        req.params.directory_id = 1;

        await getArticlesByDirectory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Lấy bài viết theo danh mục thành công!",
            data: expect.any(Array)
        });
    });

    it('should create a new article successfully', async () => {
        // Mocking the article creation
        db.Article.create.mockResolvedValue({
            id: 1,
            article_name: "New Article",
            article_title: "New Article Title",
            description: "New article description"
        });

        await createArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Thêm bài viết mới thành công!",
            data: expect.objectContaining({
                article_name: "New Article"
            })
        });
    });

    it('should update an article successfully', async () => {
        // Mocking the article found by ID
        db.Article.findByPk.mockResolvedValue({
            id: 1,
            article_name: "Old Article",
            save: jest.fn().mockResolvedValue({
                id: 1,
                article_name: "Updated Article"
            })
        });

        req.params.article_id = 1;
        req.body.article_name = "Updated Article";

        await updateArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Cập nhật bài viết thành công!",
            data: expect.objectContaining({
                article_name: "Updated Article"
            })
        });
    });

    it('should return 404 if article not found when updating', async () => {
        db.Article.findByPk.mockResolvedValue(null); // No article found

        req.params.article_id = 1;

        await updateArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Không tìm thấy bài viết!"
        });
    });

    it('should delete an article successfully', async () => {
        // Mocking the article found by ID
        db.Article.findByPk.mockResolvedValue({
            id: 1,
            destroy: jest.fn().mockResolvedValue(true)
        });

        req.params.article_id = 1;

        await deleteArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Xóa bài viết thành công!"
        });
    });

    it('should return 404 if article not found when deleting', async () => {
        db.Article.findByPk.mockResolvedValue(null); // No article found

        req.params.article_id = 1;

        await deleteArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Không tìm thấy bài viết!"
        });
    });

    it('should increment views successfully', async () => {
        // Mocking the article found by ID
        db.Article.findByPk.mockResolvedValue({
            id: 1,
            views: 10,
            save: jest.fn().mockResolvedValue({
                views: 11
            })
        });

        req.params.id = 1;

        await incrementViews(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Tăng số lượt xem thành công!",
            views: 11
        });
    });

    it('should handle unexpected errors', async () => {
        db.Article.findAll.mockRejectedValue(new Error("DB connection failed"));

        await getAllArticles(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Lỗi khi lấy danh sách bài viết!",
            error: "DB connection failed"
        });
    });
});
