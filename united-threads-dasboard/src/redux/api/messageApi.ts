import { baseApi } from "./baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/message/upload-image",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = messageApi;
