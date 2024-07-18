import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const TEST_KITS = [
  {
    name: 'Advanced Bottled Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/advanced_bottle_water_test.webp',
    description:
      'Baseline for testing bottled water and includes testing for heavy metals, minerals and volatile organic compounds (VOCs)',
    price: 285,
    affiliateLink: 'https://shrsl.com/4m0iq',
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
    name: 'Reverse Osmosis Treatment Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Reverse_Osmosis_Treatment_Water_Test_.webp',
    description:
      'Measure the effectiveness of your Reverse Osmosis water filter. Tests for 121 analytes and includes assistance in troubleshooting your filter. ',
    price: 455,
    affiliateLink: 'https://shrsl.com/4m0j0',
  },
  {
    name: 'PFAS Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/PFAS_Water_Test_.webp',
    description:
      'Tests water for PFOS, PFOA, and other PFAS compounds aka forever chemicals that are nearly impossible to breakdown.',
    price: 299,
    affiliateLink: 'https://shrsl.com/4lt0w',
  },
  {
    name: 'Microplastics Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Microplastics_Water_Test_.webp',
    description:
      'Checks for microplastics and nanoplastics in your water that are usually invisible to the naked eye.',
    price: 569,
    affiliateLink: 'https://shrsl.com/4lt0x',
  },
  {
    name: 'Comprehensive Water Test Kit',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/comprehensive_water_test_kit.webp?t=2024-07-11T15%3A29%3A08.274Z',
    description:
      'Tests for nearly all contaminants including heavy metals, bacteria, PFAS, radionuclides, pesticides, herbicides, DBPs, and more.',
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
    name: 'Extended Radiological Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Extended_Radiological_Water_Test_.webp',
    description:
      'Test for radium-226, radium-228, uranium, potassium, potassium-40, radon, cesium-137 and strontium-90, gross alpha particles and gross beta particles',
    price: 1089,
    affiliateLink: 'https://shrsl.com/4lt1o',
  },
  {
    name: 'Radiation Water Test',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/lab-testing/Full_Radiation_Water_Test_.webp?t=2024-07-17T16%3A59%3A48.071Z',
    description:
      'Test for radioactivity in water. Includes analysis of Alpha Radiation and Beta Radiation from any source–including radium, uranium, cesium, and strontium, etc',
    price: 135,
    affiliateLink: 'https://shrsl.com/4mit',
  },
]

export default function LabTestingPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 pt-14 pb-10">
        <div className="flex flex-col w-full items-center mb-8">
          <Typography size="4xl" fontWeight="normal" className="text-center">
            Order water testing kits
          </Typography>
          <Typography
            size="base"
            fontWeight="normal"
            className="mt-2 text-secondary text-center max-w-2xl"
          >
            We partner with TapScore to provide comprehensive and state of the art water testing and
            analysis. Get a personal testing kit shipped to your home to test tap water and bottled
            waters.
          </Typography>

          <div className="flex flex-row gap-4 items-center mt-4 mb-6">
            <a href="https://shrsl.com/4hhtf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Shop all tests</Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEST_KITS.map((testKit) => (
            <a
              key={testKit.name}
              className="w-full bg-card md:px-8 px-2 py-2 rounded-2xl flex flex-col gap-4 hover:shadow-lg hover:cursor-pointer"
              href={testKit.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex md:w-48 md:h-48 h-36 justify-center items-center">
                <Image
                  src={testKit.image}
                  alt={testKit.name}
                  width={700}
                  height={700}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-2 pb-4">
                <Typography size="xl" fontWeight="normal" className="">
                  {testKit.name}
                </Typography>
                <Typography size="sm" fontWeight="normal" className="text-secondary md:h-20 h-24">
                  {testKit.description}
                </Typography>
                <div className="flex flex-row justify-between items-center w-full">
                  {/* <Button variant="outline">Order now</Button> */}

                  <Typography size="xl" fontWeight="normal" className="text-secondary">
                    {testKit.price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                </div>
              </div>
            </a>
          ))}

          <a
            className="w-full px-8 py-2 rounded-2xl flex md:flex-row flex-col gap-4 hover:shadow-lg hover:cursor-pointer h-40 justify-center items-center bg-muted border border-primary"
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

        <div className="flex flex-col gap-4 py-14 px-8 rounded-2xl mt-24 bg-muted border">
          <Typography size="2xl" fontWeight="normal">
            Consulting and test inquiries
          </Typography>
          <Typography size="base" fontWeight="normal" className="mt-2 text-secondary">
            Need a custom test or want Oasis to review your water? Reach out to us at{' '}
            <a href="mailto:cormac@live-oasis.com" className="underline">
              cormac@live-oasis.com
            </a>
          </Typography>
        </div>
      </div>
    </SubpageLayout>
  )
}
