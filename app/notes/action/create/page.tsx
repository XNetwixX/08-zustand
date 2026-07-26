import type { Metadata } from "next";

import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create New Note | NoteHub",
  description: "Create a new note and save it to your NoteHub collection.",
  openGraph: {
    title: "Create New Note | NoteHub",
    description: "Create a new note and save it to your NoteHub collection.",
    url: "https://08-zustand-psi-sandy.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application preview",
      },
    ],
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
