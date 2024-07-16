import Typography from '@/components/typography'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
    value: 'testing',
    trigger: 'How can I test my water?',
    content:
      'We partner with Tapscore to provide testing kits and analyze toxins in water. You can learn more on the Lab testing page',
  },
  {
    value: 'affiliate-links',
    trigger: 'Do you use affilite links?',
    content:
      'We do add affiliate links to help fund this project and to help direct people to where to buy each product.',
  },
]

export default function FAQs() {
  return (
    <div className="w-full mt-14">
      <div className=" flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Frequently asked questions
        </Typography>
      </div>
      <Accordion type="single" collapsible className="max-w-xl">
        {FAQ_LIST.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value}>
            <AccordionTrigger className="text-primary">{faq.trigger}</AccordionTrigger>
            <AccordionContent className="text-secondary">{faq.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
