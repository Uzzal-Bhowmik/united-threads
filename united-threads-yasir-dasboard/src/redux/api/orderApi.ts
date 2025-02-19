import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (query: { label: string; value: string }[] | []) => {
        const params = new URLSearchParams();
        if (query.length) {
          query.forEach((item) => {
            params.append(item.label, item.value);
          });
        }
        return {
          url: "/order/orders",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, data }) => {
        console.log(orderId, data, "api");
        return {
          url: `/order/update-order/${orderId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Order"],
    }),
    getSingleOrder: builder.query({
      query: ({ orderId }: { orderId: string }) => {
        return {
          url: `/order/single-order/${orderId}`,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),
    getPaymentData: builder.query({
      query: ({ orderId }: { orderId: string }) => {
        return {
          url: `/payment/get-payment/${orderId}`,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),
    updateOrderPaymentStatus: builder.mutation({
      query: ({ orderId, data }) => {
        return {
          url: `/order/update-payment-status/${orderId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useGetPaymentDataQuery,
  useUpdateOrderPaymentStatusMutation,
} = orderApi;
