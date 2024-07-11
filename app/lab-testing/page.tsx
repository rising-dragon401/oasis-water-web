import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const TEST_KITS = [
  {
    name: 'Comprehensive Water Test Kit',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/comprehensive_water_test_kit.webp?t=2024-07-11T15%3A29%3A08.274Z',
    description:
      'Tests for nearly all contaminants including heavy metals, bacteria, PFAS, radionuclides, glyphosate, pesticides, herbicides, haloacetic acids, trihalomethanes, disinfection byproducts, and more.',
    price: 2750,
    affiliateLink: 'https://shrsl.com/4lt06',
  },
  {
    name: 'Extended City Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Extended_City_Water_Test_.webp',
    description:
      'Tests for the core concerns impacting utility-provided tap water, plus checks for radioactive particles and additional disinfection byproducts.',
    price: 780,
    affiliateLink: 'https://shrsl.com/4lt0c',
  },
  {
    name: 'Advanced City Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Advanced_City_Water_Test_.webp?t=2024-07-11T18%3A22%3A22.303Z',
    description:
      'Baseline for testing tap water, includes testing for heavy metals, minerals, and chlorine-related byproducts.',
    price: 290,
    affiliateLink: 'https://shrsl.com/4lt0i',
  },
  {
    name: 'PFAS Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/PFAS_Water_Test_.webp',
    description: 'Tests water for PFOS, PFOA, and other PFAS compounds.',
    price: 299,
    affiliateLink: 'https://shrsl.com/4lt0w',
  },
  {
    name: 'Microplastics Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Microplastics_Water_Test_.webp',
    description: 'Checks for microplastics in your water.',
    price: 569,
    affiliateLink: 'https://shrsl.com/4lt0x',
  },
  {
    name: 'Extended Radiological Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Extended_Radiological_Water_Test_.webp',
    description:
      'Test for radium-226, radium-228, uranium, potassium, potassium-40, radon, cesium-137 and strontium-90, gross alpha particles and gross beta particles',
    price: 1089,
    affiliateLink: 'https://shrsl.com/4lt1o',
  },
]

export default function LabTestingPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 pt-14 pb-10">
        <div className="flex flex-col w-full items-center mb-8">
          <Typography size="4xl" fontWeight="normal" className="text-center">
            Water Lab Tests and Reports
          </Typography>
          <Typography size="base" fontWeight="normal" className="mt-2 text-secondary text-center">
            We partner with TapScore to provide comprehensive and state of the art testing
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEST_KITS.map((testKit) => (
            <a
              key={testKit.name}
              className="w-full bg-card px-8 py-2 rounded-2xl flex flex-col gap-4 hover:shadow-lg hover:cursor-pointer"
              href={testKit.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex w-full h-48">
                <Image
                  src={testKit.image}
                  alt={testKit.name}
                  width={700}
                  height={700}
                  className="w-56 h-full"
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <Typography size="xl" fontWeight="normal" className="">
                  {testKit.name}
                </Typography>
                <Typography size="sm" fontWeight="normal" className="text-secondary h-24">
                  {testKit.description}
                </Typography>
                <div className="w-72 mt-2">
                  <Button variant="outline">Learn more</Button>
                </div>
              </div>
            </a>
          ))}

          <a
            className="w-full px-8 py-2 rounded-2xl flex flex-row gap-4 hover:shadow-lg hover:cursor-pointer h-40 justify-center items-center bg-muted border border-primary"
            href="https://shrsl.com/4hhtf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography size="2xl" fontWeight="normal">
              Shop other tests
            </Typography>
            <ArrowRight className="w-8 h-8 text-primary" />
          </a>
        </div>
      </div>
    </SubpageLayout>
  )
}
