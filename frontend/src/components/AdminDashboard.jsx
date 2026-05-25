import React from 'react'
import { pageBackground, pageWrapper, pageTitleClass, bodyText, cardClass } from '../styles/common'

function AdminDashboard() {
  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <h1 className={pageTitleClass}>Admin Dashboard</h1>
        <div className={`${cardClass} mt-6`}>
          <p className={bodyText}>Welcome to the admin panel. Management features can be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard