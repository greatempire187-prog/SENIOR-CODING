import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const noticeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Notice = z.infer<typeof noticeSchema>;

export const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;

const apiBase = import.meta.env.VITE_API_URL || '/api';

export const noticesApi = createApi({
  reducerPath: 'noticesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase }),
  tagTypes: ['Notices'],
  endpoints: (builder) => ({
    getNotices: builder.query<Notice[], void>({
      query: () => 'notices',
      providesTags: ['Notices'],
    }),
    createNotice: builder.mutation<Notice, CreateNoticeInput>({
      query: (body) => ({
        url: 'notices',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notices'],
    }),
  }),
});

export const { useGetNoticesQuery, useCreateNoticeMutation } = noticesApi;