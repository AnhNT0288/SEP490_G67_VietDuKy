import restClient from "../restClient";


export const ArticleService = {
    getAllArticles: () => {
        return restClient({
            url: "article",
            method: "GET",
        })
    },
    getArticleByDirectoryId: (directoryId) => {
        return restClient({
            url: `article/${directoryId}`,
            method: "GET",
        })
    },
    getArticleById: (articleId) => {
        return restClient({
            url: `article/detail/${articleId}`,
            method: "GET",
        })
    },
    incrementViewCount: (articleId) => {
        return restClient({
            url: `article/increment-views/${articleId}`,
            method: "POST",
        })
    },
    login: (data) => {
        return restClient({
            url: "auth/login",
            method: "POST",
            data
        });
    },
    incrementViews: (id) => {
        return restClient({
            url: `article/increment-views/${id}`,
            method: "POST",
        });
    }
};