import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'


export default function Layout() {
  const location = useLocation()

  return (
    <Suspense key={location.pathname} fallback={null}>
      <div className="page-enter">
        <Outlet />
      </div>
    </Suspense>
  )
}