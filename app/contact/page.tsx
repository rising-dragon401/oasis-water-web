import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import FAQs from '../faqs/components/faqs'

export default function ContactPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 py-14 items-left">
        <div className="w-full flex">
          <Typography size="3xl" fontWeight="normal">
            Contact us
          </Typography>
        </div>
        <div className="flex flex-col mt-8 bg-card rounded-md p-4 border w-72">
          <Typography size="lg" fontWeight="bold">
            Support and sales:
          </Typography>
          <Typography size="lg" fontWeight="normal">
            cormac@live-oasis.com
          </Typography>
        </div>

        <FAQs />
      </div>
    </SubpageLayout>
  )
}
