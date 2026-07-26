import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Note } from '@/types/note';

type NoteDraft = Pick<Note, 'title' | 'content' | 'tag'>;

interface NoteStore {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      clearDraft: () => {
        set({
          draft: initialDraft,
        });
      },
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({
        draft: state.draft,
      }),
    },
  ),
);