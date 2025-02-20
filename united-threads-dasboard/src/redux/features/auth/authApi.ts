import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyAccount: builder.mutation({
      query: ({ data, token }) => ({
        url: "/auth/verify-account",
        method: "POST",
        headers: { token: `${token}` },
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: { token: `${token}` },
        body: data,
      }),
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useLoginMutation,
  useVerifyAccountMutation,
  useResetPasswordMutation,
} = authApi;
