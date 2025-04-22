import restClient from "../restClient";


export const ArticleService = {
    getAllArticles: async () => {
        return restClient({
            url: "article",
            method: "GET",
        })
    },
    getArticleByDirectoryId: async (directoryId) => {
        return restClient({
            url: `article/${directoryId}`,
            method: "GET",
        })
    },
    incrementViewCount: async (articleId) => {
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
};