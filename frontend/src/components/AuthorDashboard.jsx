import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import AuthContext from '../context/AuthContext'
import { pageBackground, pageWrapper, pageTitleClass, bodyText, articleGrid, articleCardClass, articleTitle, articleExcerpt, articleMeta, emptyStateClass, errorClass, loadingClass, tagClass } from '../styles/common'
import api from '../api'

function AuthorDashboard() {
  const { currentUser } = useContext(AuthContext)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editArticleId, setEditArticleId] = useState('')
  const [editForm, setEditForm] = useState({ title: '', category: '', content: '' })
  const [actionLoading, setActionLoading] = useState(false)

  const fetchOwnArticles = async () => {
    const authorId = currentUser?._id
    if (!authorId) {
      setError('Author details not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/authors/articles/${authorId}?includeInactive=true`)
      setArticles(res.data?.payload || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your articles')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOwnArticles()
  }, [currentUser])

  const startEdit = (article) => {
    setEditArticleId(article._id)
    setEditForm({
      title: article.title || '',
      category: article.category || '',
      content: article.content || '',
    })
  }

  const cancelEdit = () => {
    setEditArticleId('')
    setEditForm({ title: '', category: '', content: '' })
  }

  const saveEdit = async () => {
    try {
      if (!editArticleId) return
      setActionLoading(true)
      await api.put(
        '/authors/articles',
        {
          articleId: editArticleId,
          title: editForm.title,
          category: editForm.category,
          content: editForm.content,
        }
      )
      cancelEdit()
      await fetchOwnArticles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article')
    } finally {
      setActionLoading(false)
    }
  }

  const softDeleteArticle = async (articleId) => {
    try {
      const confirmed = window.confirm('Delete this article? You can restore it later.')
      if (!confirmed) return
      setActionLoading(true)
      await api.patch(`/authors/articles/${articleId}`, {})
      await fetchOwnArticles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete article')
    } finally {
      setActionLoading(false)
    }
  }

  const restoreArticle = async (articleId) => {
    try {
      setActionLoading(true)
      await api.patch(`/authors/articles/${articleId}/restore`, {})
      await fetchOwnArticles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restore article')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`${pageBackground} flex min-h-screen items-center justify-center`}>
        <p className={loadingClass}>Loading your articles...</p>
      </div>
    )
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <h1 className={pageTitleClass}>My Articles</h1>
        <p className={`${bodyText} mb-8`}>Articles created by you</p>

        {error && (
          <div className={`${errorClass} mb-6`}>
            {error}
          </div>
        )}

        {!error && articles.length === 0 && (
          <div className={emptyStateClass}>
            No articles found.
          </div>
        )}

        {articles.length > 0 && (
          <div className={articleGrid}>
            {articles.map((article) => (
              <article key={article._id} className={`${articleCardClass} flex flex-col`}>
                <span className={`${tagClass} mb-3 w-fit`}>
                  {article.category || 'General'}
                </span>
                <h2 className={`${articleTitle} line-clamp-2`}>
                  {article.title}
                </h2>
                <p className={`${articleExcerpt} line-clamp-4 grow`}>
                  {article.content}
                </p>
                <div className={`${articleMeta} mt-4 border-t border-slate-200 pt-3`}>
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'No date'}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      article.isArticleActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {article.isArticleActive ? 'Active' : 'Deleted'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/articles/${article._id}`}
                    className="inline-flex rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Read Article
                  </Link>
                  {currentUser?.role === 'author' && article.isArticleActive && (
                    <button
                      type="button"
                      onClick={() => startEdit(article)}
                      disabled={actionLoading}
                      className="inline-flex rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                  )}
                  {currentUser?.role === 'author' && article.isArticleActive && (
                    <button
                      type="button"
                      onClick={() => softDeleteArticle(article._id)}
                      disabled={actionLoading}
                      className="inline-flex rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  )}
                  {currentUser?.role === 'author' && !article.isArticleActive && (
                    <button
                      type="button"
                      onClick={() => restoreArticle(article._id)}
                      disabled={actionLoading}
                      className="inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Restore
                    </button>
                  )}
                </div>

                {editArticleId === article._id && (
                  <div className="mt-4 space-y-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-md border border-indigo-300 bg-white px-3 py-2 text-sm text-indigo-900"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-md border border-indigo-300 bg-white px-3 py-2 text-sm text-indigo-900"
                      placeholder="Category"
                    />
                    <textarea
                      rows={4}
                      value={editForm.content}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                      className="w-full rounded-md border border-indigo-300 bg-white px-3 py-2 text-sm text-indigo-900"
                      placeholder="Content"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={actionLoading}
                        className="inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={actionLoading}
                        className="inline-flex rounded-md bg-slate-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorDashboard