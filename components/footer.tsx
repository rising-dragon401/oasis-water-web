import Logo from '@/components/logo'
import Link from 'next/link'
import { FaXTwitter, FaTiktok, FaYoutube, FaDiscord } from 'react-icons/fa6'
import EmailSubscribe from '@/components/email-subscribe'

export default function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex md:flex-row md:gap-2 flex-col-reverse justify-between gap-4">
          <div className="mb-4 sm:mb-0 block md:hidden">
            <div className="mb-4">
              <Link href="/" aria-label="Logo">
                <Logo />
              </Link>
            </div>
            <div className="text-sm text-secondary">
              © oaisys <span className="text-secondary">-</span> All rights reserved.
            </div>
          </div>

          {/* <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12"> */}
          {/* 1st block */}
          <div>
            <div className="h-full flex flex-col md:flex-col lg:flex-col justify-between">
              <div className="mb-4 sm:mb-0 hidden md:block">
                <div className="mb-4">
                  <Link href="/" aria-label="Logo">
                    <Logo />
                  </Link>
                </div>
                <div className="text-sm text-secondary">
                  © oaisys <span className="text-secondary">-</span> All rights reserved.
                </div>
              </div>
              <ul className="my-8 flex-row gap-4 flex list-none">
                <li>
                  <a
                    href="https://www.tiktok.com/@oaisys.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="text-primary" />
                  </a>
                </li>

                <li className="ml-2">
                  <a
                    href="https://www.tiktok.com/@oaisys.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok className="text-primary" />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.youtube.com/@oaisys_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube className="text-primary" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-secondary font-bold mb-2">Legal</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <Link
                  href="/bottled-water"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  Bottled water
                </Link>
              </li>
              <li>
                <Link
                  href="/tap-water"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  Tap water
                </Link>
              </li>
              <li>
                <Link
                  href="/filters"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  Water filters
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-secondary font-bold mb-2">Information</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <Link href="/about" className="text-secondary  transition duration-150 ease-in-out">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-secondary  transition duration-150 ease-in-out">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/manifesto"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Manifesto
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-secondary  transition duration-150 ease-in-out">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary  transition duration-150 ease-in-out">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Email signup */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-secondary font-bold mb-2">Subscribe for updates</h6>
            <EmailSubscribe />
          </div>
        </div>
      </div>
    </footer>
  )
}
