import { baseApi } from "../../api/baseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: ({ label }: { label: string }) => ({
        url: `/settings/get-settings?label=${label}`,
        method: "GET",
      }),
    }),
    createSettings: builder.mutation({
      query: (data) => ({
        url: "/settings/create-settings",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateSettingsMutation, useGetSettingsQuery } = settingsApi;
