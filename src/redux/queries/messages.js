import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import Cookies from "js-cookie";
import { TOKEN } from "../../constants";

const messageQuery = createApi({
  reducerPath: "message",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ap-portfolio-backend.up.railway.app/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${Cookies.get(TOKEN)}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (params) => ({
        method: "GET",
        url: "messages",
        params,
      }),
      transformResponse: (res) => ({
        messages: res.data.map((el) => ({ ...el, key: el._id })),
        total: res.pagination.total,
      }),
    }),
    getMessage: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `messages/${id}`
      })
    }),
    createMessage: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "messages",
        body,
      })
    }),
    updateMessage: builder.mutation({
      query: ({id, body}) => ({
        method: "PUT",
        url: `messages/${id}`,
        body,
      })
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `messages/${id}`,
      }),
    }),
    sortMessage: builder.mutation({
      query: ({status}) => ({
        method: "GET",
        url: `messages/${status}`,
      })
    })
  }),
});

const {reducer: messagesReducer, reducerPath: messagesName} = messageQuery;

export {messageQuery as default, messagesReducer, messagesName};
export const {useGetMessagesQuery, useCreateMessageMutation, useDeleteMessageMutation, useUpdateMessageMutation, useGetMessageMutation, useSortMessageMutation } = messageQuery;