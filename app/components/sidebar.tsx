'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  const routes = [
    { path: '/manualbill', name: 'Createbill' },
    { path: '/emailbill', name: 'Emailbill' },
    { path: '/dashboard', name: 'Dashboard' },
  ]

  return (
    <nav className="w-72 bg-primary h-screen p-4">
      <ul className="space-y-2">
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                pathname === route.path
                  ? 'bg-gray-300 text-black '
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar