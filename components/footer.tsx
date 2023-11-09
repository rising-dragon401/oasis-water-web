import Logo from '@/components/logo'
import Link from 'next/link'
import { FaXTwitter, FaTiktok, FaYoutube, FaDiscord } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Blocks */}
        <div className="flex md:flex-row md:gap-2 flex-col justify-between gap-4">
          <div className="mb-4 sm:mb-0 block md:hidden">
            <div className="mb-4">
              <Link href="/" aria-label="Logo">
                <Logo />
              </Link>
            </div>
            <div className="text-sm text-slate-300">
              © maia <span className="text-slate-500">-</span> All rights reserved.
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
                <div className="text-sm text-slate-300">
                  © maia <span className="text-slate-500">-</span> All rights reserved.
                </div>
              </div>
              {/* Social links */}
              <ul className="my-8 flex-row gap-4 flex list-none">
                <li>
                  <a
                    href="https://twitter.com/tellmaia_to"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter />
                  </a>
                </li>
                <li className="ml-2">
                  <a href="https://discord.gg/7qkxVkr78Q" target="_blank" rel="noopener noreferrer">
                    <FaDiscord />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.tiktok.com/@tellmaia.to"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok />
                  </a>
                </li>
                <li className="ml-2">
                  <a
                    href="https://www.youtube.com/channel/UCQYF1i-jCCzLlN1OlDpBa3w"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 2nd block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-50 font-medium mb-2">Products</h6>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Pricing & Plans
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Our method
                </a>
              </li>
            </ul>
          </div> */}

          {/* 3rd block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-50 font-medium mb-2">Company</h6>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Diversity & Inclusion
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Financial statements
                </a>
              </li>
            </ul>
          </div> */}

          {/* 4th block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-50 font-medium mb-2">
              Resources
            </h6>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="#0"
                >
                  Report a vulnerability
                </a>
              </li>
            </ul>
          </div> */}

          {/* 5th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-50 font-medium mb-2">Legal</h6>
            <ul className="text-sm space-y-2 list-none">
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="/legal/terms-of-use"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  className="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out"
                  href="/legal/privacy-policy"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
