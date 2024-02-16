import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

const FAQ_LIST = [
  {
    value: 'what-is-oasis',
    trigger: 'What is Oasis?',
    content:
      'Oasis is a project we started to help find a healthier, cleaner source of water. We collect all the hard to find scientific data surrounding water, brands and filters and put it into one searchable website. Long-term we are on a mission to source the cleanest and healthiest source of water to you. ',
  },
  {
    value: 'data',
    trigger: 'Where do you get your data from?',
    content:
      'We get our data from science-backed research papers, official water testing reports, non-profit research centers like EWG and from leading scientific experts.',
  },
  {
    value: 'affiliate-links',
    trigger: 'Do you use affilite links?',
    content:
      'We do add affiliate links to the highest recommended products, usually those with a score above 80. We do this to provide to help direct people to the best products and to help fund Oasis.',
  },
]

export default function FAQs() {
  return (
    <SubpageLayout>
      <div className="w-full mt-14">
        <div className="pt-4 pb-8 flex flex-row justify-between">
          <Typography size="2xl" fontWeight="normal">
            Frequently asked questions
          </Typography>
        </div>
        <Accordion type="single" collapsible>
          {FAQ_LIST.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="text-primary">{faq.trigger}</AccordionTrigger>
              <AccordionContent className="text-secondary">{faq.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SubpageLayout>
  )
}
