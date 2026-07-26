import type { Note, NoteTag } from '@/types/note';

import { noteHubApi } from './client';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
  tag?: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteHubApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      search,
      ...(tag ? { tag } : {}),
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