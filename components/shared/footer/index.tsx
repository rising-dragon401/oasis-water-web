import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import { kInstagram, kTikTok, kTwitter, kYouTube } from '@/lib/constants/socials'
import Link from 'next/link'
import { useState } from 'react'
import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import EmailSubscribe from '../email-subscribe'
import { FeedbackModal } from '../feedback-modal'

export default function Footer() {
  const [openFeedback, setOpenFeedback] = useState(false)

  return (
    <footer className="overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex md:flex-row md:gap-2 flex-col-reverse justify-between md:items-start items-center gap-4">
          <div className="mb-4 sm:mb-0 block md:hidden">
            <div className="mb-4 flex justify-center md:justify-start">
              <Link href="/" aria-label="Logo">
                <Logo />
              </Link>
            </div>
            <div className="text-sm text-secondary">
              © Oasis <span className="text-secondary">-</span> All rights reserved.
            </div>
          </div>

          <div className="h-full flex flex-col md:flex-col lg:flex-col justify-between items-center md:items-start">
            <div className="mb-4 sm:mb-0 hidden md:block">
              <div className="mb-4">
                <Link href="/" aria-label="Logo">
                  <Logo />
                </Link>
              </div>
              <div className="text-sm text-secondary">
                © Oasis <span className="text-secondary">-</span> All rights reserved.
              </div>
            </div>
            <ul className="my-8 flex-row gap-4 flex list-none">
              <li>
                <a href={kTwitter} target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="text-primary" />
                </a>
              </li>
              <li className="ml-2">
                <a href={kInstagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-primary" />
                </a>
              </li>
              <li className="ml-2">
                <a href={kTikTok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="text-primary" />
                </a>
              </li>
              <li className="ml-2">
                <a href={kYouTube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="text-primary" />
                </a>
              </li>
              {/* <li className="ml-2">
                <a href="https://discord.gg/AhapvnXxAy" target="_blank" rel="noopener noreferrer">
                  <FaDiscord className="text-primary" />
                </a>
              </li> */}
            </ul>
          </div>

          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 md:text-left md:items-start flex flex-col justify-center items-center text-center">
            <h6 className="text-sm text-secondary font-bold mb-2">Company</h6>
            <ul className="text-sm space-y-2 list-none">
              {/* <li>
                <Link
                  href={kTelegramJoinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Telegram community
                </Link>
              </li> */}
              <li>
                <Link
                  href="/mission"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliates"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Affiliates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 md:text-left md:items-start flex flex-col justify-center items-center text-center">
            <h6 className="text-sm text-secondary font-bold mb-2">Information</h6>
            <ul className="text-sm space-y-2 list-none">
              <FeedbackModal open={openFeedback} setOpen={setOpenFeedback} />

              <li>
                <Link
                  href="/lab-testing"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  Lab testing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/oasis_scoring"
                  className="text-secondary transition duration-150 ease-in-out"
                >
                  How scoring works
                </Link>
              </li>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpenFeedback(true)
                }}
              >
                Feedback
              </div>
            </ul>
          </div>

          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 md:text-left md:items-start flex flex-col justify-center items-center text-center">
            <h6 className="text-sm text-secondary font-bold mb-2">Legal</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-secondary  transition duration-150 ease-in-out"
                >
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary  transition duration-150 ease-in-out">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <EmailSubscribe />
          </div>
        </div>

        <div className="py-2 text-center mt-8 bg-muted border-input border rounded-lg">
          <Typography size="sm" fontWeight="normal">
            🌴 Created by {` `}
            <a
              href="https://twitter.com/cormachayden_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Cormac Hayden
            </a>
          </Typography>
        </div>
      </div>
    </footer>
  )
}
