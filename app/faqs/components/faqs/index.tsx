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
    value: 'what-is-oaisys',
    trigger: 'What is Oaisys?',
    content:
      'Oaisys is a project we started to help find a healthier, cleaner source of water. We collect all the hard to find scientific data surrounding water, brands and filters and put it into one searchable website. Long-term we are on a mission to source the cleanest and healthiest source of water to you. ',
  },
  {
    value: 'scoring',
    trigger: 'How is each score determined',
    content:
      'We have developed a formula which takes all the scientific data behind each water/product, the levels of each ingredient and contaminant into account along with things like environmental impact, packaging and brand reputation. We then give each water/product a score out of 100 based on this data.',
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
      'We do add affiliate links to the highest recommended products, usually those with a score above 80. We do this to provide to help direct people to the best products and to help fund Oaisys.',
  },
]

export default function FAQs() {
  return (
    <SubpageLayout>
      <div className="md:px-8 px-4 mt-14">
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
