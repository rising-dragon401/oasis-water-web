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
    value: 'do-you-get-paid-to-promote-brands',
    trigger: 'Do you get paid to promote brands?',
    content:
      'Nope. We never do paid sponsorships, ads or any type of paid promotion. All data and marketing is purely based off the lab and research and funded by us.',
  },
  {
    value: 'how-scoring-works',
    trigger: 'How does the scoring work?',
    content:
      'Scoring for waters and filters is mainly based on contaminant levels and performance data presented in the lab reports. Check How scoring works page for more details.',
  },
  {
    value: 'tap-water-rated-higher',
    trigger: 'Why is some tap water rated higher than bottled waters?',
    content:
      'Tap water ratings are scored on a different scale than bottled water ratings. And should not be direclty compared.',
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
      'We do add affiliate links to help fund this project and to help direct people to where to buy each product.',
  },
  {
    value: 'testing',
    trigger: 'Can I get my water tested?',
    content:
      'We partner with Tapscore to provide testing kits and analyze toxins in water. You can learn more on the Lab testing page',
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
      <Accordion type="single" collapsible className="w-full gap-4">
        {FAQ_LIST.map((faq) => (
          <AccordionItem
            key={faq.value}
            value={faq.value}
            className="border line my-4 rounded-md px-4"
          >
            <AccordionTrigger className="text-primary text-left">{faq.trigger}</AccordionTrigger>
            <AccordionContent className="text-secondary">{faq.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
