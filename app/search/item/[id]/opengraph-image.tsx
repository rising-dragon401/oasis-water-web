// Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { getItem } from '@/app/actions/items'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'
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
  const item = (await getItem(id)) as Item | null

  const image = item?.image || OG_IMAGE
  const name = item?.name || 'Oasis'
  const title = 'Is ' + item?.name + ' healthy?' || 'Oasis'
  const tagline = `Uncover the truth about ${name} and latest scientific data behind it.`

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

        {/* Product Image */}
        <img
          src={image}
          width={400}
          height={400}
          style={{
            objectFit: 'contain',
            borderRadius: '40px',
            // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          alt={`Image for ${name}`}
        />
      </div>
    ),
    { headers: { 'Content-Type': contentType } }
  )
}
