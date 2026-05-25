import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import AuthContext from '../context/AuthContext'
import api from '../api'
import {
  pageBackground,
  pageWrapper,
  pageTitleClass,
  bodyText,
  cardClass,
  articleBody,
  articleMeta,
  errorClass,
  loadingClass,
  secondaryBtn,
  tagClass,
} from '../styles/common'

function ArticleDetails() {
  const { articleId } = useParams()
  const { currentUser, isAuthenticated } = useContext(AuthContext)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await api.get(`/users/articles/${articleId}`)

      setArticle(res.data?.payload || null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load article')
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const handleAddComment = async () => {
    try {
      setCommentError('')
      setCommentSuccess('')

      const trimmedComment = commentText.trim()
      if (!trimmedComment) {
        setCommentError('Please enter a comment')
        return
      }

      if (!isAuthenticated || !currentUser?._id) {
        setCommentError('Please login to add a comment')
        return
      }

      setCommentLoading(true)

      await api.post(
        '/users/articles/comments',
        {
          articleId,
          comment: trimmedComment,
          userId: currentUser._id,
        }
      )

      setCommentText('')
      setCommentSuccess('Comment added successfully')
      await fetchArticle()
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`${pageBackground} flex min-h-screen items-center justify-center`}>
        <p className={loadingClass}>Loading article...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper}>
          <div className={errorClass}>{error}</div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper}>
          <div className={errorClass}>Article not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <Link to="/user-dashboard" className={secondaryBtn}>
          Back to Dashboard
        </Link>

        <article className={`${cardClass} mt-4`}>
          <span className={`${tagClass} mb-3 inline-flex`}>{article.category || 'General'}</span>
          <h1 className={pageTitleClass}>{article.title}</h1>
          <p className={`${articleMeta} mt-3`}>
            By {article.author?.firstName || 'Unknown'} {article.author?.lastName || ''} •{' '}
            {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'No date'}
          </p>
          <p className={`${articleBody} mt-6 whitespace-pre-wrap`}>{article.content}</p>
          {article.comments?.length > 0 && (
            <p className={`${bodyText} mt-6`}>{article.comments.length} comment{article.comments.length !== 1 ? 's' : ''}</p>
          )}

          {isAuthenticated && (
            <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50/60 p-4">
              <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-indigo-900">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="Write your comment here..."
                className="w-full rounded-md border border-indigo-300 bg-white px-3 py-2 text-sm text-indigo-900 outline-none transition focus:border-indigo-500"
              />
              {commentError && <p className="mt-2 text-sm text-red-600">{commentError}</p>}
              {commentSuccess && <p className="mt-2 text-sm text-green-700">{commentSuccess}</p>}
              <button
                type="button"
                onClick={handleAddComment}
                disabled={commentLoading}
                className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {commentLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          )}

          {article.comments?.length > 0 && (
            <div className="mt-6 space-y-3">
              {article.comments.map((item, idx) => (
                <div key={item._id || idx} className="rounded-md border border-indigo-100 bg-white p-3">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-600">
                    {' '}
                    {item.user?.firstName
                      ? `${item.user.firstName} ${item.user?.lastName || ''}`.trim()
                      : 'Unknown user'}
                  </p>
                  <p className="text-sm text-indigo-900">{item.comment}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default ArticleDetails
