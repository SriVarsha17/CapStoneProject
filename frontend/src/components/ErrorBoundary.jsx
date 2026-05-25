import React from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

function ErrorBoundary() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  const skeletonImg =
    'https://img.freepik.com/premium-vector/skeleton-doing-yoga-funny-tshirt-design-vector_621660-4320.jpg?semt=ais_hybrid&w=740&q=80'

  const title = is404 ? '404 - Page Not Found' : 'Something went wrong'
  const message = is404
    ? 'The URL path is invalid. Please go back to a valid page.'
    : (isRouteErrorResponse(error) ? error.statusText : error?.message) || 'Unexpected error'

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-cyan-50 via-sky-50 to-indigo-100 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <img
            src={skeletonImg}
            alt="Skeleton placeholder for invalid page"
            className="h-auto w-full "
          />
        </div>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <p className="font-semibold">KRUPIYA DHYAN DHE</p>
          <p className="mt-1">MAKI MIKI CHEPTUNDHI ENTI ANTE  <br />MIRU ENTER CHESINA URL TAPPU UNDHI.</p>
          <p className="mt-1">DHAYACHESI CORRECT URL OPEN CHEYYANDI.</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary