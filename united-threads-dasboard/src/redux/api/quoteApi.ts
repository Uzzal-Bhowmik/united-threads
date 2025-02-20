import { baseApi } from "./baseApi";

const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: (query: { label: string; value?: string }[] | []) => {
        const params = new URLSearchParams();
        if (query.length) {
          query.forEach((item) => {
            if (item.value && item.value !== "ALL") {
              params.append(item.label, item.value);
            }
          });
        }

        return {
          url: "/quote/quotes",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Quote"],
    }),

    updateQuote: builder.mutation({
      query: ({ quoteId, data }) => ({
        url: `/quote/update-quote/${quoteId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    deleteQuote: builder.mutation({
      query: ({ quoteId }) => ({
        url: `/quote/delete-quote/${quoteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quote"],
    }),

    getSingleQuote: builder.query({
      query: ({ quoteId }) => ({
        url: `/quote/single-quote/${quoteId}`,
        method: "GET",
      }),
      providesTags: ["Quote"],
    }),
  }),
});

export const {
  useGetQuotesQuery,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useGetSingleQuoteQuery,
} = quoteApi;
