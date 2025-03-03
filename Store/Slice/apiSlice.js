import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookie from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  prepareHeaders: (Headers) => {
    const token = Cookie.get("accessToken");
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userData) => ({
        url: "/sign-up",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: () => "/users/get-user",
    }),
    updateUser: builder.mutation({
      query: ({ data, token }) => ({
        url: "/users/update-user",
        method: "PUT",
        body: data,
        extra: token,
      }),
    }),
    getPost: builder.query({
      query: ({ page = 1, perPage = 20 }) =>
        `/posts/get-feed-posts?page=${page}&perPage=${perPage}`,
      // Store posts in Redux state
      transformResponse: (response) => {
        return response.data.data || [];
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Post", id })), "Post"]
          : ["Post"],
    }),
    getImagePost: builder.query({
      query: (postId) => `/posts/get-feed-image?postId=${postId}`,
      transformResponse: (response) => {
        return response.imageData || null;
      },
    }),
    createPost: builder.mutation({
      invalidatesTags: ["Post"], // Invalidate the post cache on creation

      query: ({ data, token }) => ({
        url: "/posts/create-post",
        method: "POST",
        body: data,
        extra: token,
      }),
    }),
  }),
});

export default apiSlice;
export const {
  useGetUserQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useCreatePostMutation,
  useGetPostQuery,
  useSignUpMutation,
  useGetImagePostQuery,
} = apiSlice;
