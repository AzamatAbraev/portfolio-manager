import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { TOKEN } from "../../constants";

const experienceQuery = createApi({
  reducerPath: "experience",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ap-portfolio-backend.up.railway.app/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${Cookies.get(TOKEN)}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: (params) => ({
        method: "GET",
        url: "experiences",
        params,
      }),
      transformResponse: (res) => ({
        experiences: res.data.map((el) => ({ ...el, key: el._id })),
        total: res.pagination.total,
      }),
    }),
    createExperience: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "experiences",
        body,
      }),
    }),
    updateExperience: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `experiences/${id}`,
        body,
      }),
    }),
    getExperience: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `experiences/${id}`,
      }),
      transformResponse: (res) => ({
        ...res,
        startDate: res.startDate?.split("T")[0],
        endDate: res.endDate?.split("T")[0],
      }),
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `experiences/${id}`,
      }),
    }),
  }),
});

const { reducer: experienceReducer, reducerPath: experienceName } =
  experienceQuery;

export { experienceQuery as default, experienceReducer, experienceName };

export const {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useGetExperienceMutation,
  useDeleteExperienceMutation,
} = experienceQuery;
