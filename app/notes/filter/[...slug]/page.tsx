import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import { fetchNotes } from "@/lib/api";

import NotesClient from "./Notes.client";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const ogImage = {
  url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  width: 1200,
  height: 630,
  alt: "NoteHub application preview",
};

export const generateMetadata = async ({
  params,
}: NotesPageProps): Promise<Metadata> => {
  const { slug } = await params;

  const currentTag = slug[0];
  const isAllNotes = currentTag.toLowerCase() === "all";

  const title = isAllNotes
    ? "Notes - All Tags | NoteHub"
    : `Notes - ${currentTag} | NoteHub`;

  const description = isAllNotes
    ? "Browse all notes in NoteHub."
    : `Browse notes filtered by the ${currentTag} tag.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-psi-sandy.vercel.app/notes/filter/${currentTag}`,
      images: [ogImage],
    },
  };
};

const NotesPage = async ({ params }: NotesPageProps) => {
  const { slug } = await params;

  const currentTag = slug[0];
  const tag = currentTag === "all" ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesPage;

export const dynamic = "force-dynamic";
