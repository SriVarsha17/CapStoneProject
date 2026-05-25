import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { pageBackground, pageWrapper, pageTitleClass, bodyText, articleGrid, articleCardClass, articleTitle, articleExcerpt, articleMeta, emptyStateClass, errorClass, loadingClass } from '../styles/common'
import api from '../api'

function UserDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users/articles')
        setArticles(res.data.payload || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Failed to load articles')
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) {
    return (
      <div className={`${pageBackground} flex min-h-screen items-center justify-center`}>
        <p className={loadingClass}>Loading articles...</p>
      </div>
    )
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <h1 className={pageTitleClass}>Articles</h1>
        <p className={`${bodyText} mb-8`}>Discover articles from all authors</p>

        {error && (
          <div className={`${errorClass} mb-8`}>
            {error}
          </div>
        )}

        {articles.length === 0 ? (
          <div className={emptyStateClass}>
            <p>No articles available yet</p>
          </div>
        ) : (
          <div className={articleGrid}>
            {articles.map((article) => (
              <div key={article._id} className={`${articleCardClass} flex h-full flex-col`}>

                {/* Card Body */}
                <div className="flex grow flex-col">
                  <h3 className={`${articleTitle} line-clamp-2`}>
                    {article.title}
                  </h3>
                  
                  <p className={`${articleExcerpt} line-clamp-3 grow`}>
                    {article.content}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <div className={`${articleMeta} mb-2 flex items-center justify-between`}>
                      <span>By {article.author?.firstName}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>

                    {article.comments && article.comments.length > 0 && (
                      <p className={articleMeta}>
                         {article.comments.length} comment{article.comments.length !== 1 ? 's' : ''}
                      </p>
                    )}

                    <div className="mt-3">
                      <Link
                        to={`/articles/${article._id}`}
                        className="inline-flex rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard