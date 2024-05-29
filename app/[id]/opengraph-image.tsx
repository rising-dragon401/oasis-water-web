// Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { getCurrentUserData } from '@/app/actions/user'
import ScoreOG from '@/components/shared/score-og'
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
export default async function Image({ params }: { params: { id: string } }) {
  // user id
  const id = params.id

  const userData = await getCurrentUserData(id)
  const avatar = userData?.avatar_url || OG_IMAGE

  const image = avatar
  const score = userData?.score || 0
  const name = userData?.full_name

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          paddingLeft: '36px',
          paddingRight: '36px',
        }}
      >
        <img
          src={image || OG_IMAGE}
          width="160px"
          height="160px"
          style={{ objectFit: 'contain' }}
          alt="image for water"
        />

        <p style={{ fontSize: 48, width: '1000px', textAlign: 'center' }}>
          {name && name + "'s"} water health score:{' '}
        </p>

        <div style={{ display: 'flex', paddingTop: '20px', paddingBottom: '20px' }}>
          <ScoreOG score={score} />
        </div>
      </div>
    )
  )
}
