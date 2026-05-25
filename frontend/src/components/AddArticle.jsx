import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { pageBackground, formCard, formTitle, labelClass, inputClass, formGroup, submitBtn, errorClass } from '../styles/common';
import api from '../api';

function AddArticle() {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setApiError('');
      console.log('Add article request payload:', data);

      const res = await api.post('/authors/articles', data);

      console.log('Created article details:', res.data?.payload || res.data);

      toast.success('Article published successfully');
      reset();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to publish article';
      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={pageBackground}>
      <div className="px-4 py-10 sm:px-6">
        <div className={formCard}>
          <h2 className={formTitle}>Create New Article</h2>

        {apiError && <p className={`${errorClass} mb-4`}>{apiError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' },
                maxLength: { value: 200, message: 'Title must not exceed 200 characters' },
              })}
              className={inputClass}
              placeholder="Enter article title"
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={inputClass}
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              rows="8"
              {...register('content', {
                required: 'Content is required',
                minLength: { value: 50, message: 'Content must be at least 50 characters' },
                maxLength: { value: 10000, message: 'Content must not exceed 10000 characters' },
              })}
              className={`${inputClass} min-h-40 resize-none`}
              placeholder="Write your article content here..."
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </div>

          <button type="submit" className={submitBtn} disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default AddArticle;