import { baseApi } from "./baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuoteCategories: builder.query({
      query: () => ({
        url: "/quote-category/categories",
        method: "GET",
      }),
      providesTags: ["QuoteCategory"],
    }),
    addQuoteCategory: builder.mutation({
      query: (data) => ({
        url: "/quote-category/create-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuoteCategory"],
    }),
    updateQuoteCategory: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/quote-category/update-category/${categoryId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["QuoteCategory"],
    }),
    deleteQuoteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/quote-category/delete-category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuoteCategory"],
    }),
  }),
});

export const {
  useGetQuoteCategoriesQuery,
  useAddQuoteCategoryMutation,
  useUpdateQuoteCategoryMutation,
  useDeleteQuoteCategoryMutation,
} = categoryApi;
