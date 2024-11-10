import { Home, Newspaper, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Typography from '../typography'

const MENU_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  // {
  //   label: 'Top',
  //   href: '/top-rated',
  //   icon: Trophy,
  // },
  {
    label: 'Research',
    href: '/blog',
    icon: Newspaper,
  },
  // {
  //   label: 'Profile',
  //   href: '/favorites',
  //   icon: User,
  // },
  {
    label: 'Settings',
    href: '/account',
    icon: Settings,
  },
]

const BottomNavbar = () => {
  const pathname = usePathname()
  const activeIndex = MENU_ITEMS.findIndex((item) => item.href === pathname)

  return (
    <div className="fixed bottom-0 py-3 left-0 right-0 bg-muted border-t border-gray-200 flex justify-around items-center shadow-md">
      {MENU_ITEMS.map((item, index) => {
        const isActive = activeIndex === index
        const isActiveClass = isActive ? 'text-primary' : '!text-gray-400'

        return (
          <Link href={item.href} key={item.label} className={`flex-1 focus:opacity-75`}>
            <div className="flex flex-col items-center justify-center gap-1">
              <item.icon className={`h-6 w-6 ${isActiveClass}`} />

              <Typography size="sm" fontWeight="normal" className={isActiveClass}>
                {item.label}
              </Typography>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default BottomNavbar
