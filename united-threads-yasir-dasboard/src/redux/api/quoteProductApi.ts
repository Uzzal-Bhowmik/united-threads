import { baseApi } from "./baseApi";

const quoteProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuoteProducts: builder.query({
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
          url: "/quote-product/products",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["QuoteProduct"],
    }),
    addQuoteProduct: builder.mutation({
      query: (data) => ({
        url: "/quote-product/create-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuoteProduct"],
    }),

    updateQuoteProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/quote-product/update-product/${productId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["QuoteProduct"],
    }),

    deleteQuoteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/quote-product/delete-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuoteProduct"],
    }),

    getSingleQuoteProduct: builder.query({
      query: ({ productId }) => ({
        url: `/quote-product/single-product/${productId}`,
        method: "GET",
      }),
      providesTags: ["QuoteProduct"],
    }),
  }),
});

export const {
  useGetQuoteProductsQuery,
  useAddQuoteProductMutation,
  useUpdateQuoteProductMutation,
  useDeleteQuoteProductMutation,
  useGetSingleQuoteProductQuery,
} = quoteProductApi;
