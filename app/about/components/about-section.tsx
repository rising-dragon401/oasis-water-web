import Typography from '@/components/typography'

// const meta = {
//   title: 'About Oasis',
//   description:
//     'Making conscious water purchases is now just a click away. Our platform ensures only water products rated over 70 are available for your selection, guaranteeing your choices are healthy and informed. With us, it’s no guesswork, only good decisions.',
//   cardImage:
//     'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/twitter_open_graph.png',
// }

// export const metadata = {
//   metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oaisys.com'),
//   openGraph: {
//     title: meta.title,
//     description: meta.description,
//     images: [
//       {
//         url: meta.cardImage,
//         width: 800,
//         height: 600,
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: meta.title,
//     description: meta.description,
//     images: [meta.cardImage],
//   },
// }

export default function AboutSection() {
  return (
    <div className="flex flex-col px-8 py-20">
      <Typography size="lg" className="text-primary" fontWeight="normal">
        “At Oasis, we’re dedicated to simplifying the journey towards conscious consumption. We
        believe everyone deserves to know exactly what they’re putting into their bodies,
        effortlessly. In a world where water labels and food packaging may not disclose contaminants
        like nitrates, we step in to remove the guesswork. Our mission is to centralize all
        necessary data, making it easy for individuals to make informed choices about their drinking
        water and beyond. We strive for transparency, empowering our community and team with the
        knowledge needed for a healthier, more conscious lifestyle. Together, we’re not just making
        choices; we’re making a difference.”
      </Typography>
    </div>
  )
}
