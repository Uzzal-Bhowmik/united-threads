import { baseApi } from "./baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (query: { label: string; value: string }[] | []) => {
        const params = new URLSearchParams();
        if (query.length) {
          query.forEach((item) => {
            params.append(item.label, item.value);
          });
        }
        return {
          url: "/notification/notifications",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["NOTIFICATION"],
    }),
    seenNotifications: builder.mutation({
      query: () => ({
        url: "/notification/seen",
        method: "PATCH",
      }),
      invalidatesTags: ["NOTIFICATION"],
    }),
  }),
});

export const { useGetNotificationsQuery, useSeenNotificationsMutation } = usersApi;
