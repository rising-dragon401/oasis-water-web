import { OpenAI } from 'langchain/llms/openai'

export const LLM_MODELS = {
  'gpt-3': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4': 'gpt-4-1106-preview',
}

type Props = {
  overRideModel?: string
}

export async function getModel({ overRideModel }: Props) {
  let model = LLM_MODELS['gpt-4']

  return new OpenAI({
    modelName: model,
    user: 'unknown',
    // configuration: {
    //   basePath: 'https://oai.hconeai.com/v1',
    //   baseOptions: {
    //     headers: {
    //       'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`
    //     }
    //   }
    // },
    temperature: 0.7,
    streaming: true,
  })
}
