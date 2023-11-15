if (typeof window !== 'undefined') import('@dotlottie/player-component')

export default function Loader() {
  return (
    <>
      <dotlottie-player
        src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/animations/waves.lottie"
        autoplay
        loop
        style={{ height: '100%', width: '100%' }}
      />
    </>
  )
}
