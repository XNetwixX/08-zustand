import axios from 'axios';

import type { Note, NoteTag } from '@/types/note';

const noteHubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteHubApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      search,
    },
  });

  return response.data;
};

export const createNote = async (
  note: CreateNoteParams,
): Promise<Note> => {
  const response = await noteHubApi.post<Note>('/notes', note);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await noteHubApi.delete<Note>(`/notes/${noteId}`);

  return response.data;
};

export const fetchNoteById = async (
  noteId: string,
): Promise<Note> => {
  const response = await noteHubApi.get<Note>(`/notes/${noteId}`);

  return response.data;
};