import React from 'react'
import { pageBackground, pageWrapper, pageTitleClass, bodyText, cardClass } from '../styles/common'

function Home() {
  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <h1 className={pageTitleClass}>Welcome to Blog App</h1>
        <div className={`${cardClass} mt-6`}>
          <p className={bodyText}>Create an account, publish articles, and explore content from other authors.</p>
        </div>
      </div>
    </div>
  )
}

export default Home