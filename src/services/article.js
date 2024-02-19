import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const rapidKey = process.env.REACT_APP_RAPID_API_ARTICLE_KEY

export const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: fetchBaseQuery({
        baseUrl:'https://article-extractor-and-summarizer.p.rapidapi.com/',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidKey);
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com')
        }
    }),
    endpoints: (builder) =>({
        getSummary: builder.query({
            query: (params) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=4`
        })
    })
});

const {useLazyGetSummaryQuery} = articleApi;

export default useLazyGetSummaryQuery;