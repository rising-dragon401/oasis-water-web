import Logo from '@/components/shared/logo'
import Link from 'next/link'
import { FaXTwitter, FaTiktok, FaYoutube, FaInstagram, FaDiscord } from 'react-icons/fa6'
import EmailSubscribe from '../email-subscribe'
import JoinWaitListButton from '../join-waitlist-button'
import Typography from '@/components/typography'

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
              © Oasis <span className="text-secondary">-</span> All rights reserved.
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
                  © oasis <span className="text-secondary">-</span> All rights reserved.
                </div>
              </div>
              <ul className="my-8 flex-row gap-4 flex list-none">
                <li>
                  <a
                    href="https://twitter.com/oasiswatersco"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="text-primary" />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.instagram.com/oasiswatersco"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-primary" />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.tiktok.com/@oasiswatersco"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok className="text-primary" />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.youtube.com/@oasiswatersco"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube className="text-primary" />
                  </a>
                </li>
                <li className="ml-2">
                  <a href="https://discord.gg/AhapvnXxAy" target="_blank" rel="noopener noreferrer">
                    <FaDiscord className="text-primary" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-secondary font-bold mb-2">Quick links</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <Link
                  href="/search/bottled-water"
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
            </ul>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-secondary font-bold mb-2">Information</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <Link
                  href="/mission"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Mission
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

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 w-72">
            <>
              <Typography
                size="base"
                fontWeight="bold"
                className="text-sm text-secondary font-bold mb-2"
              >
                Join the waitlist
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-sm text-secondary mb-2">
                We are working on a something special that will change the way you drink water and
                access health products.
              </Typography>
              <JoinWaitListButton />
            </>
          </div>
        </div>
      </div>
    </footer>
  )
}
