import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css'

export default function Loader({
  height = '100%',
  width = '100%',
}: {
  height?: string
  width?: string
}) {
  return <DotLottiePlayer src="/animations/waves.lottie" autoplay loop style={{ height, width }} />
}
