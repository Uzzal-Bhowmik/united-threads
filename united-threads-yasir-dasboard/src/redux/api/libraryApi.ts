import { create } from "domain";
import { baseApi } from "./baseApi";

const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLibrary: builder.mutation({
      query: (data) => ({
        url: "/library/create-library",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["LIBRARY"],
    }),
    getLibraries: builder.query({
      query: (query: { label: string; value: string }[] | []) => {
        const params = new URLSearchParams();
        if (query.length) {
          query.forEach((item) => {
            params.append(item.label, item.value);
          });
        }
        return {
          url: "/library/libraries",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["LIBRARY"],
    }),

    deleteLibrary: builder.mutation({
      query: ({ libraryId }) => ({
        url: `/library/delete-library/${libraryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LIBRARY"],
    }),
  }),
});

export const { useCreateLibraryMutation, useGetLibrariesQuery, useDeleteLibraryMutation } =
  libraryApi;
