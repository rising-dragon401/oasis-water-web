// Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { ImageResponse } from 'next/og'
import ScoreOG from '@/components/shared/score-og'
import { getFilter } from '@/app/actions/filters'
import { WaterFilter } from '@/types/custom'
import { OG_IMAGE } from '@/lib/constants/images'

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
  const filter = (await getFilter(id)) as WaterFilter | null

  const image = filter && filter.image
  const score = filter && filter.score

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
            <ScoreOG score={40} />
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  )
}
