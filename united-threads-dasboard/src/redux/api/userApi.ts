import { baseApi } from "./baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (query: { label: string; value: string }[] | []) => {
        const params = new URLSearchParams();
        if (query.length) {
          query.forEach((item) => {
            params.append(item.label, item.value);
          });
        }
        return {
          url: "/user/all-users",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, data }) => {
        return {
          url: `/user/update-user/${userId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Users"],
    }),
    getSingleUser: builder.query({
      query: ({ userId }: { userId?: string }) => {
        return {
          url: `/user/single-user/${userId}`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),

    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetSingleUserQuery,
  useGetProfileQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
  useUpdateUserMutation,
} = usersApi;
