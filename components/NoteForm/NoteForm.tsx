'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  type FormikHelpers,
} from 'formik';
import * as Yup from 'yup';

import {
  createNote,
  type CreateNoteParams,
} from '@/lib/api';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const noteTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const initialValues: CreateNoteParams = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must contain at least 3 characters')
    .max(50, 'Title must contain no more than 50 characters')
    .required('Title is required'),

  content: Yup.string().max(
    500,
    'Content must contain no more than 500 characters',
  ),

  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, 'Select a valid tag')
    .required('Tag is required'),
});

const NoteForm = ({ onClose }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      onClose();
    },
  });

  const handleSubmit = async (
    values: CreateNoteParams,
    actions: FormikHelpers<CreateNoteParams>,
  ): Promise<void> => {
    try {
      await createMutation.mutateAsync(values);
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>

            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />

            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>

            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />

            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>

            <Field
              as="select"
              id="tag"
              name="tag"
              className={css.select}
            >
              {noteTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>

            <ErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              {createMutation.isPending
                ? 'Creating...'
                : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;