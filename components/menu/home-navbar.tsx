import Link from 'next/link'
import Logo from '../shared/logo'
import { P } from '../ui/typography'

export default function HomeNavbar() {
  return (
    <div className="flex w-full items-center gap-6">
      <Link href="/" className="flex flex-row items-center justify-center hover:cursor-pointer">
        <Logo className="w-8 h-8" />
        <P className="!text-accent text-md">Oasis</P>
      </Link>
      <Link href="/" className="cursor-pointer">
        <P className="text-sm hover:font-bold">Home</P>
      </Link>

      <Link href="/product-testing" className="cursor-pointer">
        <P className="text-sm hover:font-bold">Testing</P>
      </Link>

      <Link href="/blog" className="cursor-pointer">
        <P className="text-sm hover:font-bold">Research</P>
      </Link>

      <Link href="/contact" className="cursor-pointer">
        <P className="text-sm hover:font-bold">Contact</P>
      </Link>
    </div>
  )
}
