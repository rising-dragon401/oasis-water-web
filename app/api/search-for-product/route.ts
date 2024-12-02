import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const requestBody = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }).catch((error) => {
    console.error('Error sending image to OpenAI:', error)
    throw error
  })

  const data = await response.json()

  console.log('data: ', data)

  return NextResponse.json(data)
}
