import SubpageLayout from '@/components/home-layout'
import { OG_IMAGE } from '@/lib/constants/images'
import ContactForm from './componenents/contact-form'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oasiswater.app/'),
  title: 'Contact Us | Oasis Water',
  description:
    'Get in touch with Oasis to request products, submit lab results, or receive support for water and filter testing. Join us in improving transparency.',
  openGraph: {
    title: 'Contact Us | Oasis Water',
    description:
      'Reach out to Oasis to request product testing, submit lab results, or ask for support. Help us make water transparency accessible to everyone.',
    siteName: 'Oasis',
    images: [
      {
        url: OG_IMAGE,
        width: 800,
        height: 600,
        alt: 'Contact Oasis for water transparency',
      },
      {
        url: OG_IMAGE,
        width: 1800,
        height: 1600,
        alt: 'Submit water testing requests and lab results',
      },
    ],
    locale: 'en_US',
    type: 'website',
    url: new URL('/contact', process.env.NEXT_PUBLIC_BASE_URL || '').toString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Oasis Water',
    description:
      'Reach out to Oasis to request products, share lab results, or ask for support. Together, we can improve water transparency.',
    images: [OG_IMAGE],
  },
}

export default function ContactPage() {
  return (
    <SubpageLayout>
      <ContactForm />
    </SubpageLayout>
  )
}
