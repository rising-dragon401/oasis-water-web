import { getFilter } from '@/app/actions/filters'
import { OG_IMAGE } from '@/lib/constants/images'
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({
  params,
  format = 'png',
}: {
  params: { id: string }
  format?: 'png' | 'jpeg'
}) {
  const id = params.id

  const logoImage =
    'https://connect.live-oasis.com/storage/v1/object/public/website/logo/oasis_icon_word.png'

  // Fetch data
  const filter = (await getFilter(id)) as any | null

  const image = filter?.image || OG_IMAGE
  const name = filter?.name || 'Oasis'
  const title = 'Is the ' + filter?.name + ' effective?' || 'Oasis'
  const tagline = `Uncover the truth about ${name} and how well it filters contaminants in your water.`

  console.log('filter', filter)

  const contentType = format === 'jpeg' ? 'image/jpeg' : 'image/png'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          paddingLeft: '70px',
          paddingRight: '50px',
          paddingTop: '40px',
          paddingBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'flex-start',
          }}
        >
          <img
            src={logoImage}
            width={100}
            height={40}
            style={{
              marginBottom: '1rem',
              objectFit: 'contain',
            }}
            alt={`Image for ${name}`}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              marginTop: '-40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '2.4rem',
                fontWeight: 'bold',
                maxWidth: '420px',
                flexWrap: 'wrap',
              }}
            >
              <p>{title}</p>
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                color: '#6b7280',
                display: 'flex',
                maxWidth: '420px',
                flexWrap: 'wrap',
              }}
            >
              {tagline}
            </div>
          </div>
        </div>

        <img
          src={image}
          width={400}
          height={400}
          style={{
            objectFit: 'contain',
            borderRadius: '40px',
          }}
          alt={`Image for ${name}`}
        />
      </div>
    ),
    { headers: { 'Content-Type': contentType } }
  )
}
