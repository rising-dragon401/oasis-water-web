// Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { ImageResponse } from 'next/og'
import ScoreOG from '@/components/shared/score-og'
import { getItem } from '@/app/actions/items'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const id = params.id

  // fetch data
  const item = (await getItem(id)) as Item | null

  const image = item && item.image
  const score = item && item.score

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={image || OG_IMAGE}
          width="100%"
          height="100%"
          style={{ objectFit: 'contain' }}
          alt="image for water"
        />
        {score && (
          <div style={{ display: 'flex', position: 'absolute', top: 60, right: 50 }}>
            <ScoreOG score={score} />
          </div>
        )}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      //   fonts: [
      //     {
      //       name: 'Inter',
      //       data: await interSemiBold,
      //       style: 'normal',
      //       weight: 400,
      //     },
      //   ],
    }
  )
}
