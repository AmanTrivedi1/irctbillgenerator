'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
const Sidebar = () => {
  const pathname = usePathname()
  const routes = [
    { path: '/manualbill', name: 'Createbill' },
    { path: '/emailbill', name: 'Emailbill' },
    { path: '/dashboard', name: 'Dashboard' },
  ]

  return (
    <>
    <nav className="w-72 hidden sm:block  bg-primary min-h-screen p-4">
      <ul className="space-y-2">
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                pathname === route.path
                  ? 'bg-white text-black '
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    <div className=' sm:hidden'>
    <Sheet>
  <SheetTrigger>
     <Menu />
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
    <nav className="">
      <ul className="space-y-2">
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                pathname === route.path
                  ? '  bg-primary text-white'
                  : 'text-gray-300 hover:bg-primary hover:text-white'
              }`}>
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </SheetHeader>
  </SheetContent>
</Sheet>
</div>


    </>
    


  )
}

export default Sidebar