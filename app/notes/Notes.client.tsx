'use client';

import { useCallback, useState } from 'react';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api';

import css from './NotesPage.module.css';

const NotesClient = () => {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () =>
      fetchNotes({
        page,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string): void => {
    setInputValue(value);
    updateSearch(value);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={handleSearchChange}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={handleOpenModal}
        >
          Create note +
        </button>
      </header>

      {isPending && <p>Loading, please wait...</p>}

      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default NotesClient;