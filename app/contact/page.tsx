import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import FAQs from '../faqs/components/faqs'

export default function ContactPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col justify-center w-full px-4">
        <div className="max-w-lg">
          <Typography size="3xl" fontWeight="normal">
            Contact us
          </Typography>
        </div>
        <Typography size="lg" fontWeight="normal">
          Email: cormac@live-oasis.com
        </Typography>
        <FAQs />
      </div>
    </SubpageLayout>
  )
}
